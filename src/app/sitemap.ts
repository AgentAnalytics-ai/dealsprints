import type { MetadataRoute } from "next";
import { MOCK_MEMBERS } from "@/lib/data/mockFeed";

export default function sitemap(): MetadataRoute.Sitemap {
  // Generate member profile URLs
  const memberUrls = MOCK_MEMBERS
    .filter(m => m.isActive)
    .map(member => ({
      url: `https://dealsprints.com/okc/members/${member.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  
  const urls: MetadataRoute.Sitemap = [
    { 
      url: "https://dealsprints.com/", 
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    { 
      url: "https://dealsprints.com/okc/feed", 
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    { 
      url: "https://dealsprints.com/okc/members", 
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    { 
      url: "https://dealsprints.com/waitlist", 
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    { 
      url: "https://dealsprints.com/about", 
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    { 
      url: "https://dealsprints.com/privacy", 
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    { 
      url: "https://dealsprints.com/terms", 
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...memberUrls,
  ];
  
  return urls;
}
