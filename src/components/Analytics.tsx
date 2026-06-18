import Script from "next/script";
import { PUBLIC_ENV } from "@/lib/env";

/**
 * Conditionally injects privacy-friendly analytics. Renders nothing if no
 * provider is configured, so the site is fully functional without tracking.
 */
export function Analytics() {
  const { plausibleDomain, plausibleHost, gaMeasurementId } = PUBLIC_ENV;

  return (
    <>
      {plausibleDomain && (
        <Script
          defer
          data-domain={plausibleDomain}
          src={`${plausibleHost}/js/script.js`}
          strategy="afterInteractive"
        />
      )}
      {gaMeasurementId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaMeasurementId}', { anonymize_ip: true });`}
          </Script>
        </>
      )}
    </>
  );
}
