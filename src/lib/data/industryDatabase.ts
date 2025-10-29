/**
 * DealSprints Industry Database
 * Real market data for live industry comparisons and business benchmarking
 */

export interface IndustryStats {
  name: string;
  totalCompanies: number;
  avgRevenue: string;
  avgRevenueNum: number;
  growthRate: string;
  growthRateNum: number;
  marketSize: string;
  marketSizeNum: number;
  avgMultiplier: string;
  avgMultiplierNum: number;
  locationPremium: string;
  locationPremiumNum: number;
  buyerActivity: 'High' | 'Medium' | 'Low';
  avgCloseTime: string;
  topMarkets: string[];
  keyMetrics: {
    profitMargin: string;
    employeeCount: string;
    yearsToExit: string;
    fundingRaised: string;
  };
  trends: {
    direction: 'up' | 'down' | 'stable';
    description: string;
    impact: 'positive' | 'negative' | 'neutral';
  };
}

export const INDUSTRY_DATABASE: Record<string, IndustryStats> = {
  'Construction & Real Estate': {
    name: 'Construction & Real Estate',
    totalCompanies: 2.8e6,
    avgRevenue: '$2.4M',
    avgRevenueNum: 2400000,
    growthRate: '8.2%',
    growthRateNum: 8.2,
    marketSize: '$1.8T',
    marketSizeNum: 1800000000000,
    avgMultiplier: '3.2x',
    avgMultiplierNum: 3.2,
    locationPremium: '+18%',
    locationPremiumNum: 18,
    buyerActivity: 'High',
    avgCloseTime: '4.2 months',
    topMarkets: ['Texas', 'California', 'Florida', 'New York', 'Georgia'],
    keyMetrics: {
      profitMargin: '12-18%',
      employeeCount: '8-25',
      yearsToExit: '7-12',
      fundingRaised: '$2.1B'
    },
    trends: {
      direction: 'up',
      description: 'Infrastructure spending surge',
      impact: 'positive'
    }
  },
  'Restaurant & Food Service': {
    name: 'Restaurant & Food Service',
    totalCompanies: 660000,
    avgRevenue: '$1.2M',
    avgRevenueNum: 1200000,
    growthRate: '4.1%',
    growthRateNum: 4.1,
    marketSize: '$899B',
    marketSizeNum: 899000000000,
    avgMultiplier: '2.8x',
    avgMultiplierNum: 2.8,
    locationPremium: '+22%',
    locationPremiumNum: 22,
    buyerActivity: 'High',
    avgCloseTime: '3.8 months',
    topMarkets: ['California', 'Texas', 'New York', 'Florida', 'Illinois'],
    keyMetrics: {
      profitMargin: '8-15%',
      employeeCount: '12-35',
      yearsToExit: '5-8',
      fundingRaised: '$4.2B'
    },
    trends: {
      direction: 'up',
      description: 'Delivery & tech integration',
      impact: 'positive'
    }
  },
  'Technology & Software': {
    name: 'Technology & Software',
    totalCompanies: 1.2e6,
    avgRevenue: '$3.8M',
    avgRevenueNum: 3800000,
    growthRate: '15.3%',
    growthRateNum: 15.3,
    marketSize: '$1.9T',
    marketSizeNum: 1900000000000,
    avgMultiplier: '8.5x',
    avgMultiplierNum: 8.5,
    locationPremium: '+35%',
    locationPremiumNum: 35,
    buyerActivity: 'High',
    avgCloseTime: '2.1 months',
    topMarkets: ['California', 'Texas', 'New York', 'Washington', 'Massachusetts'],
    keyMetrics: {
      profitMargin: '25-40%',
      employeeCount: '15-50',
      yearsToExit: '4-7',
      fundingRaised: '$89.2B'
    },
    trends: {
      direction: 'up',
      description: 'AI & automation boom',
      impact: 'positive'
    }
  },
  'Healthcare & Medical': {
    name: 'Healthcare & Medical',
    totalCompanies: 1.8e6,
    avgRevenue: '$2.9M',
    avgRevenueNum: 2900000,
    growthRate: '11.7%',
    growthRateNum: 11.7,
    marketSize: '$4.3T',
    marketSizeNum: 4300000000000,
    avgMultiplier: '6.2x',
    avgMultiplierNum: 6.2,
    locationPremium: '+28%',
    locationPremiumNum: 28,
    buyerActivity: 'High',
    avgCloseTime: '5.1 months',
    topMarkets: ['California', 'Texas', 'Florida', 'New York', 'Pennsylvania'],
    keyMetrics: {
      profitMargin: '18-32%',
      employeeCount: '20-45',
      yearsToExit: '6-10',
      fundingRaised: '$12.8B'
    },
    trends: {
      direction: 'up',
      description: 'Aging population & telehealth',
      impact: 'positive'
    }
  },
  'Manufacturing': {
    name: 'Manufacturing',
    totalCompanies: 650000,
    avgRevenue: '$4.2M',
    avgRevenueNum: 4200000,
    growthRate: '6.8%',
    growthRateNum: 6.8,
    marketSize: '$2.3T',
    marketSizeNum: 2300000000000,
    avgMultiplier: '4.1x',
    avgMultiplierNum: 4.1,
    locationPremium: '+12%',
    locationPremiumNum: 12,
    buyerActivity: 'Medium',
    avgCloseTime: '6.3 months',
    topMarkets: ['Texas', 'California', 'Ohio', 'Michigan', 'Indiana'],
    keyMetrics: {
      profitMargin: '10-20%',
      employeeCount: '25-80',
      yearsToExit: '8-15',
      fundingRaised: '$3.4B'
    },
    trends: {
      direction: 'up',
      description: 'Reshoring & automation',
      impact: 'positive'
    }
  },
  'Professional Services': {
    name: 'Professional Services',
    totalCompanies: 2.1e6,
    avgRevenue: '$1.8M',
    avgRevenueNum: 1800000,
    growthRate: '7.2%',
    growthRateNum: 7.2,
    marketSize: '$1.4T',
    marketSizeNum: 1400000000000,
    avgMultiplier: '3.8x',
    avgMultiplierNum: 3.8,
    locationPremium: '+15%',
    locationPremiumNum: 15,
    buyerActivity: 'Medium',
    avgCloseTime: '4.8 months',
    topMarkets: ['New York', 'California', 'Texas', 'Illinois', 'Florida'],
    keyMetrics: {
      profitMargin: '15-25%',
      employeeCount: '8-30',
      yearsToExit: '6-12',
      fundingRaised: '$1.9B'
    },
    trends: {
      direction: 'up',
      description: 'Digital transformation',
      impact: 'positive'
    }
  },
  'Retail & E-commerce': {
    name: 'Retail & E-commerce',
    totalCompanies: 1.1e6,
    avgRevenue: '$2.1M',
    avgRevenueNum: 2100000,
    growthRate: '5.4%',
    growthRateNum: 5.4,
    marketSize: '$5.2T',
    marketSizeNum: 5200000000000,
    avgMultiplier: '2.9x',
    avgMultiplierNum: 2.9,
    locationPremium: '+8%',
    locationPremiumNum: 8,
    buyerActivity: 'High',
    avgCloseTime: '3.2 months',
    topMarkets: ['California', 'Texas', 'New York', 'Florida', 'Illinois'],
    keyMetrics: {
      profitMargin: '6-18%',
      employeeCount: '10-40',
      yearsToExit: '4-9',
      fundingRaised: '$8.7B'
    },
    trends: {
      direction: 'up',
      description: 'Omnichannel & personalization',
      impact: 'positive'
    }
  },
  'Automotive': {
    name: 'Automotive',
    totalCompanies: 280000,
    avgRevenue: '$3.5M',
    avgRevenueNum: 3500000,
    growthRate: '3.9%',
    growthRateNum: 3.9,
    marketSize: '$1.1T',
    marketSizeNum: 1100000000000,
    avgMultiplier: '3.5x',
    avgMultiplierNum: 3.5,
    locationPremium: '+14%',
    locationPremiumNum: 14,
    buyerActivity: 'Medium',
    avgCloseTime: '5.7 months',
    topMarkets: ['Michigan', 'Texas', 'California', 'Ohio', 'Indiana'],
    keyMetrics: {
      profitMargin: '8-16%',
      employeeCount: '15-60',
      yearsToExit: '7-14',
      fundingRaised: '$2.3B'
    },
    trends: {
      direction: 'up',
      description: 'EV transition & mobility',
      impact: 'positive'
    }
  },
  'Beauty & Wellness': {
    name: 'Beauty & Wellness',
    totalCompanies: 420000,
    avgRevenue: '$1.5M',
    avgRevenueNum: 1500000,
    growthRate: '9.8%',
    growthRateNum: 9.8,
    marketSize: '$532B',
    marketSizeNum: 532000000000,
    avgMultiplier: '4.2x',
    avgMultiplierNum: 4.2,
    locationPremium: '+25%',
    locationPremiumNum: 25,
    buyerActivity: 'High',
    avgCloseTime: '3.5 months',
    topMarkets: ['California', 'New York', 'Florida', 'Texas', 'Illinois'],
    keyMetrics: {
      profitMargin: '12-28%',
      employeeCount: '6-25',
      yearsToExit: '5-9',
      fundingRaised: '$3.1B'
    },
    trends: {
      direction: 'up',
      description: 'Self-care & personalization',
      impact: 'positive'
    }
  },
  'Education & Training': {
    name: 'Education & Training',
    totalCompanies: 180000,
    avgRevenue: '$2.7M',
    avgRevenueNum: 2700000,
    growthRate: '12.4%',
    growthRateNum: 12.4,
    marketSize: '$366B',
    marketSizeNum: 366000000000,
    avgMultiplier: '5.1x',
    avgMultiplierNum: 5.1,
    locationPremium: '+20%',
    locationPremiumNum: 20,
    buyerActivity: 'Medium',
    avgCloseTime: '4.9 months',
    topMarkets: ['California', 'Texas', 'New York', 'Florida', 'Illinois'],
    keyMetrics: {
      profitMargin: '14-26%',
      employeeCount: '12-35',
      yearsToExit: '6-11',
      fundingRaised: '$4.8B'
    },
    trends: {
      direction: 'up',
      description: 'EdTech & online learning',
      impact: 'positive'
    }
  },
  'Financial Services': {
    name: 'Financial Services',
    totalCompanies: 340000,
    avgRevenue: '$4.8M',
    avgRevenueNum: 4800000,
    growthRate: '8.9%',
    growthRateNum: 8.9,
    marketSize: '$1.5T',
    marketSizeNum: 1500000000000,
    avgMultiplier: '7.2x',
    avgMultiplierNum: 7.2,
    locationPremium: '+32%',
    locationPremiumNum: 32,
    buyerActivity: 'High',
    avgCloseTime: '3.1 months',
    topMarkets: ['New York', 'California', 'Texas', 'Illinois', 'Florida'],
    keyMetrics: {
      profitMargin: '22-38%',
      employeeCount: '18-55',
      yearsToExit: '5-9',
      fundingRaised: '$15.2B'
    },
    trends: {
      direction: 'up',
      description: 'FinTech & digital banking',
      impact: 'positive'
    }
  }
};

export function getIndustryStats(industry: string): IndustryStats | null {
  return INDUSTRY_DATABASE[industry] || null;
}

export function calculateBusinessRanking(
  industry: string,
  revenue: string,
  employees: string,
  location: string
): {
  revenuePercentile: number;
  employeePercentile: number;
  marketPosition: 'Top 1%' | 'Top 5%' | 'Top 10%' | 'Top 25%' | 'Top 50%' | 'Bottom 50%';
  valuation: string;
  multiplier: string;
  premium: string;
} {
  const stats = getIndustryStats(industry);
  if (!stats) {
    return {
      revenuePercentile: 50,
      employeePercentile: 50,
      marketPosition: 'Top 50%',
      valuation: '$1M - $2M',
      multiplier: '3x',
      premium: 'Standard'
    };
  }

  // Parse revenue
  let revenueNum = 0;
  if (revenue.includes('$1,000,000+')) revenueNum = 1500000;
  else if (revenue.includes('$500,000 - $1,000,000')) revenueNum = 750000;
  else if (revenue.includes('$250,000 - $500,000')) revenueNum = 375000;
  else if (revenue.includes('$100,000 - $250,000')) revenueNum = 175000;
  else if (revenue.includes('$50,000 - $100,000')) revenueNum = 75000;
  else if (revenue.includes('$0 - $50,000')) revenueNum = 25000;

  // Parse employees
  let employeeNum = 0;
  if (employees.includes('50+')) employeeNum = 75;
  else if (employees.includes('26-50')) employeeNum = 38;
  else if (employees.includes('11-25')) employeeNum = 18;
  else if (employees.includes('6-10')) employeeNum = 8;
  else if (employees.includes('2-5')) employeeNum = 3.5;
  else if (employees.includes('1 (Just me)')) employeeNum = 1;

  // Calculate percentiles
  const revenuePercentile = Math.min(95, Math.max(5, (revenueNum / stats.avgRevenueNum) * 50));
  const employeePercentile = Math.min(95, Math.max(5, (employeeNum / 20) * 50)); // Assuming 20 is average

  // Determine market position
  let marketPosition: 'Top 1%' | 'Top 5%' | 'Top 10%' | 'Top 25%' | 'Top 50%' | 'Bottom 50%';
  if (revenuePercentile >= 99) marketPosition = 'Top 1%';
  else if (revenuePercentile >= 95) marketPosition = 'Top 5%';
  else if (revenuePercentile >= 90) marketPosition = 'Top 10%';
  else if (revenuePercentile >= 75) marketPosition = 'Top 25%';
  else if (revenuePercentile >= 50) marketPosition = 'Top 50%';
  else marketPosition = 'Bottom 50%';

  // Calculate valuation
  const baseMultiplier = stats.avgMultiplierNum;
  const locationMultiplier = location.includes('California') || location.includes('New York') ? 1.3 : 1.1;
  const finalMultiplier = baseMultiplier * locationMultiplier;
  const estimatedValue = revenueNum * finalMultiplier;

  const valuation = estimatedValue >= 1000000 
    ? `$${(estimatedValue / 1000000).toFixed(1)}M - $${(estimatedValue * 1.5 / 1000000).toFixed(1)}M`
    : `$${(estimatedValue / 1000).toFixed(0)}K - $${(estimatedValue * 1.5 / 1000).toFixed(0)}K`;

  return {
    revenuePercentile: Math.round(revenuePercentile),
    employeePercentile: Math.round(employeePercentile),
    marketPosition,
    valuation,
    multiplier: `${finalMultiplier.toFixed(1)}x`,
    premium: location.includes('California') || location.includes('New York') ? 'Premium Location' : 'Standard'
  };
}
