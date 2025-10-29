'use client';

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

interface LiveInsight {
  headline: string;
  summary: string;
  quick_score: number;
  recommendations: string[];
}

interface LiveInsightsContextType {
  liveInsight: LiveInsight | null;
  liveLoading: boolean;
  updateInsights: (formData: any) => void;
}

const LiveInsightsContext = createContext<LiveInsightsContextType | undefined>(undefined);

export function LiveInsightsProvider({ children }: { children: ReactNode }) {
  const [liveInsight, setLiveInsight] = useState<LiveInsight | null>(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchPreview = async (formData: any) => {
    try {
      // cancel previous
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      const payload = {
        business_name: formData.business_name || '',
        industry: formData.industry || '',
        location: formData.location || '',
        annual_revenue: formData.annual_revenue || '',
        employee_count: formData.employee_count || '',
      };

      setLiveLoading(true);
      const res = await fetch('/api/assessment/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: abortRef.current.signal,
      });
      if (!res.ok) throw new Error('Preview failed');
      const data = await res.json();
      setLiveInsight(data.insight);
    } catch (e) {
      // silence preview errors
    } finally {
      setLiveLoading(false);
    }
  };

  const updateInsights = (formData: any) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => fetchPreview(formData), 450);
  };

  // Initial load
  useEffect(() => {
    fetchPreview({});
  }, []);

  return (
    <LiveInsightsContext.Provider value={{ liveInsight, liveLoading, updateInsights }}>
      {children}
    </LiveInsightsContext.Provider>
  );
}

export function useLiveInsights() {
  const context = useContext(LiveInsightsContext);
  if (context === undefined) {
    throw new Error('useLiveInsights must be used within a LiveInsightsProvider');
  }
  return context;
}
