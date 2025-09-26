"use client";

import { useState, useEffect } from 'react';
import { Hero } from "@/components/Hero";
import { StatsBand } from "@/components/StatsBand";
import { Process } from "@/components/Process";
import { TopNavigation } from "@/components/TopNavigation";
import { FreeEvaluationTab } from "@/components/FreeEvaluationTab";
import { BusinessMarketplaceTab } from "@/components/BusinessMarketplaceTab";
import { RecentlySoldTab } from "@/components/RecentlySoldTab";
import { MarketInsightsTab } from "@/components/MarketInsightsTab";
import { CtaSection } from "@/components/CtaSection";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('evaluation');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleTabChange = (tab: string) => {
    if (tab !== activeTab) {
      setIsLoading(true);
      setActiveTab(tab);
      // Simulate loading for smooth transition
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Tabs at the very top - before hero */}
      <TopNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      
      {/* Hero section */}
      <Hero />
      <StatsBand />
      <Process />
      
      {/* Tab Content */}
      <section className="bg-gray-50 min-h-screen">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          renderTabContent()
        )}
      </section>
      
      <CtaSection />
      <Footer />
    </main>
  );
}
