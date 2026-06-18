import { NextResponse } from "next/server";
import { SERVER_ENV } from "@/lib/env";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = {
  name?: string;
  email?: string;
  company?: string;
  arr?: string;
  message?: string;
  company_website?: string; // honeypot
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: silently accept bot submissions without doing anything.
  if (body.company_website) {
    return NextResponse.json({ ok: true, message: "Thanks." });
  }

  const name = (body.name || "").trim().slice(0, 120);
  const email = (body.email || "").trim().toLowerCase();
  const company = (body.company || "").trim().slice(0, 160);
  const arr = (body.arr || "").trim().slice(0, 60);
  const message = (body.message || "").trim().slice(0, 4000);

  if (!name || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please provide your name and a valid email." },
      { status: 422 },
    );
  }

  const lead = { name, email, company, arr, message, at: new Date().toISOString() };

  try {
    if (SERVER_ENV.leadWebhookUrl) {
      const res = await fetch(SERVER_ENV.leadWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "metrics_review", ...lead }),
      });
      if (!res.ok) {
        console.error("[lead] webhook rejected with status", res.status);
        return NextResponse.json(
          { error: "We couldn't send that. Please email us instead." },
          { status: 502 },
        );
      }
      return NextResponse.json({ ok: true, message: "Thanks — we'll be in touch within two business days." });
    }

    if (SERVER_ENV.resendApiKey && SERVER_ENV.leadNotifyEmail) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SERVER_ENV.resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "SaaSGauge <onboarding@resend.dev>",
          to: [SERVER_ENV.leadNotifyEmail],
          reply_to: email,
          subject: `New metrics-review request from ${name}${company ? ` (${company})` : ""}`,
          text: `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nARR: ${arr}\n\n${message}`,
        }),
      });
      if (!res.ok) {
        console.error("[lead] Resend rejected with status", res.status);
        return NextResponse.json(
          { error: "We couldn't send that. Please email us instead." },
          { status: 502 },
        );
      }
      return NextResponse.json({ ok: true, message: "Thanks — we'll be in touch within two business days." });
    }

    // No provider configured: log so the lead isn't lost in dev/preview.
    console.info("[lead] (no provider configured)", lead);
    return NextResponse.json({
      ok: true,
      message: "Thanks — your request was received.",
    });
  } catch (err) {
    console.error("[lead] error", err);
    return NextResponse.json(
      { error: "We couldn't send that. Please email us instead." },
      { status: 500 },
    );
  }
}
