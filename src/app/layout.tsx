import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DealSprints - Professional Business Valuation & M&A Advisory",
  description: "Get your business valued by certified professionals. Confidential process, pre-qualified acquirers, 60-day close guarantee.",
  keywords: "business valuation, M&A advisory, business broker, sell business, confidential process",
  authors: [{ name: "DealSprints" }],
  creator: "DealSprints",
  publisher: "DealSprints",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dealsprints.com",
    siteName: "DealSprints",
    title: "Professional Business Valuation & M&A Advisory",
    description: "Get your business valued by certified professionals. Confidential process, pre-qualified acquirers, 60-day close guarantee.",
    images: [
      {
        url: "https://dealsprints.com/og/home.png",
        width: 1200,
        height: 630,
        alt: "DealSprints - Professional Business Valuation & M&A Advisory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Business Valuation & M&A Advisory",
    description: "Get your business valued by certified professionals. Confidential process, pre-qualified acquirers, 60-day close guarantee.",
    images: ["https://dealsprints.com/og/home.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://dealsprints.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "DealSprints",
              "url": "https://dealsprints.com",
              "logo": "https://dealsprints.com/logo.png",
              "description": "Professional business valuation and M&A advisory services",
              "foundingDate": "2024",
              "sameAs": [
                "https://twitter.com/dealsprints",
                "https://linkedin.com/company/dealsprints"
              ]
            })
          }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
