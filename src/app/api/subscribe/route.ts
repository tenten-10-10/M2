import { NextResponse } from "next/server";
import { SERVER_ENV } from "@/lib/env";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = { email?: string; source?: string; tag?: string };

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const source = (body.source || "site").slice(0, 60);
  const tag = (body.tag || "").slice(0, 60);

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 422 },
    );
  }

  // Track whether any provider was configured & attempted, so we only return
  // the dev-only success fallback when NONE is configured. A configured
  // provider that rejects must surface an error, not a false "subscribed".
  let attempted = false;

  try {
    // 1) Buttondown
    if (SERVER_ENV.buttondownApiKey) {
      attempted = true;
      const res = await fetch("https://api.buttondown.email/v1/subscribers", {
        method: "POST",
        headers: {
          Authorization: `Token ${SERVER_ENV.buttondownApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          tags: tag ? [tag] : undefined,
          metadata: { source },
        }),
      });
      // 200/201 created; 400 often means already subscribed — treat as success.
      if (res.ok || res.status === 400) {
        return NextResponse.json({ ok: true, message: "You're subscribed — check your inbox." });
      }
      console.error("[subscribe] Buttondown rejected with status", res.status);
    }

    // 2) ConvertKit (Kit)
    if (SERVER_ENV.convertkitApiKey && SERVER_ENV.convertkitFormId) {
      attempted = true;
      const res = await fetch(
        `https://api.convertkit.com/v3/forms/${SERVER_ENV.convertkitFormId}/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: SERVER_ENV.convertkitApiKey,
            email,
            tags: tag ? [tag] : undefined,
          }),
        },
      );
      if (res.ok) {
        return NextResponse.json({ ok: true, message: "You're subscribed — check your inbox." });
      }
      console.error("[subscribe] ConvertKit rejected with status", res.status);
    }

    // 3) Generic webhook
    if (SERVER_ENV.emailWebhookUrl) {
      attempted = true;
      const res = await fetch(SERVER_ENV.emailWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, tag }),
      });
      if (res.ok) {
        return NextResponse.json({ ok: true, message: "You're on the list." });
      }
      console.error("[subscribe] webhook rejected with status", res.status);
    }

    // A provider was configured but every attempt failed — be honest.
    if (attempted) {
      return NextResponse.json(
        { error: "We couldn't add you right now. Please try again shortly." },
        { status: 502 },
      );
    }

    // No provider configured: accept gracefully so UX works in dev.
    console.info(`[subscribe] (no provider configured) ${email} | ${source} | ${tag}`);
    return NextResponse.json({
      ok: true,
      message: "You're on the list. (Connect an email provider to deliver automatically.)",
    });
  } catch (err) {
    console.error("[subscribe] error", err);
    return NextResponse.json(
      { error: "We couldn't add you right now. Please try again." },
      { status: 500 },
    );
  }
}
