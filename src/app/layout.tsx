import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OKC Pulse - Oklahoma City's Feed of Developments, Openings & Business Network | DealSprints",
  description: "Stay updated on Oklahoma City's latest business developments, grand openings, and expansions. Join OKC's verified network of local entrepreneurs and business owners.",
  keywords: "OKC business news, Oklahoma City developments, local business network, OKC entrepreneurs, business openings OKC, Oklahoma City business community",
  authors: [{ name: "DealSprints OKC" }],
  creator: "DealSprints",
  publisher: "DealSprints",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dealsprints.com",
    siteName: "DealSprints OKC Pulse",
    title: "OKC Pulse - Your City's Business Growth Feed",
    description: "Oklahoma City's fast feed of exciting developments, new business openings, and verified network of local entrepreneurs.",
    images: [
      {
        url: "https://dealsprints.com/og/okc-pulse.png",
        width: 1200,
        height: 630,
        alt: "OKC Pulse - Oklahoma City Business Feed & Network",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OKC Pulse - Oklahoma City Business Feed",
    description: "Stay updated on OKC's latest developments, openings, and connect with verified local business owners.",
    images: ["https://dealsprints.com/og/okc-pulse.png"],
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
              "name": "DealSprints OKC",
              "alternateName": "OKC Pulse",
              "url": "https://dealsprints.com",
              "logo": "https://dealsprints.com/logo.png",
              "description": "Oklahoma City's pulse on business growth - featuring local developments, new openings, and a verified network of entrepreneurs",
              "foundingDate": "2024",
              "areaServed": {
                "@type": "City",
                "name": "Oklahoma City",
                "sameAs": "https://en.wikipedia.org/wiki/Oklahoma_City"
              },
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
