"use client";

import { useState } from 'react';
import { Hero } from "@/components/Hero";
import { StatsBand } from "@/components/StatsBand";
import { Process } from "@/components/Process";
import { TabNavigation } from "@/components/TabNavigation";
import { FreeEvaluationTab } from "@/components/FreeEvaluationTab";
import { BusinessMarketplaceTab } from "@/components/BusinessMarketplaceTab";
import { RecentlySoldTab } from "@/components/RecentlySoldTab";
import { MarketInsightsTab } from "@/components/MarketInsightsTab";
import { CtaSection } from "@/components/CtaSection";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('evaluation');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'evaluation':
        return <FreeEvaluationTab />;
      case 'marketplace':
        return <BusinessMarketplaceTab />;
      case 'sold':
        return <RecentlySoldTab />;
      case 'insights':
        return <MarketInsightsTab />;
      default:
        return <FreeEvaluationTab />;
    }
  };

  return (
    <main className="min-h-screen">
      <Hero />
      <StatsBand />
      <Process />
      
      {/* Zillow-Style Tab Navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Tab Content */}
      <section className="bg-gray-50">
        {renderTabContent()}
      </section>
      
      <CtaSection />
      <Footer />
    </main>
  );
}
