import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") || "SaaSGauge").slice(0, 100);
  const subtitle = (
    searchParams.get("subtitle") || "Free SaaS metrics calculators"
  ).slice(0, 140);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #142357 0%, #1b5cf5 100%)",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              height: "64px",
              width: "64px",
              borderRadius: "9999px",
              background: "#ffffff",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "34px",
            }}
          >
            📊
          </div>
          <div style={{ color: "#bcd9ff", fontSize: "32px", fontWeight: 700 }}>
            SaaSGauge
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#ffffff",
              fontSize: "62px",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: "#d9eaff",
              fontSize: "30px",
              marginTop: "20px",
              maxWidth: "900px",
            }}
          >
            {subtitle}
          </div>
        </div>
        <div style={{ display: "flex", color: "#8ec2ff", fontSize: "24px" }}>
          Free • No signup • Benchmark-backed
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
