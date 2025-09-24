import { Metadata } from "next";
import { Assessment } from '@/components/Assessment';

export const metadata: Metadata = {
  title: "Sell My Business | DealSprints",
  description: "Confidential business valuation and buyer matchmaking. Get your business sold in 60 days or less.",
  alternates: { 
    canonical: "https://dealsprints.com/sell" 
  },
  openGraph: {
    title: "Sell My Business | DealSprints",
    description: "Confidential business valuation and buyer matchmaking. Get your business sold in 60 days or less.",
    url: "https://dealsprints.com/sell",
    siteName: "DealSprints",
    locale: "en_US",
    type: "website",
  },
};

export default function SellPage() {
  return (
    <main className="min-h-screen">
      <Assessment />
    </main>
  );
}
