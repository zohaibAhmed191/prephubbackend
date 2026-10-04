import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "react-hot-toast";

const siteTitle = "PrepHub PK - Pakistan's #1 Government Job Preparation Platform";
const siteDescription = "Find FPSC, PPSC, SPSC, NTS, CSS, NPF job alerts and prepare with MCQs, mock tests, and study material. Free for everyone.";
// Set SITE_URL in production if the live domain differs, this
// is what canonical/OG URLs resolve against (also used by sitemap.ts/robots.ts).
const SITE_URL = process.env.SITE_URL || 'https://prephubpk.com';
// Google Tag Manager container ID (e.g. GTM-XXXXXXX). Set GTM_ID in Vercel's
// environment variables. If it's not set, GTM is simply not loaded.
const GTM_ID = process.env.GTM_ID?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: siteTitle,
  description: siteDescription,
  keywords: "FPSC jobs, PPSC jobs, SPSC jobs, NTS test, CSS exam, NPF Testing and Assessment Services, Pakistan government jobs, MCQ practice, mock test, PrepHub PK",
  applicationName: "PrepHub PK",
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    siteName: "PrepHub PK",
    type: "website",
    locale: "en_PK",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
        {GTM_ID && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}
      </head>
      <body suppressHydrationWarning>
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <AuthProvider googleClientId={process.env.GOOGLE_CLIENT_ID || ''}>
          {children}
          <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
        </AuthProvider>
      </body>
    </html>
  );
}