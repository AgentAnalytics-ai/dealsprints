/**
 * Mock Data for OKC Pulse Feed
 * Phase 1: No database - manually curated content
 * Update this file weekly to add new posts/members
 */

export interface Post {
  id: string;
  kind: 'development' | 'opening' | 'expansion' | 'event' | 'data-insight';
  title: string;
  location: string;
  address?: string;
  lat?: number;
  lng?: number;
  date: string;
  summary: string;
  source: string;
  sourceUrl?: string;
  tags: string[];
  imageUrl?: string;
}

export interface Member {
  slug: string;
  businessName: string;
  ownerName?: string;
  category: string;
  tagline: string;
  bio?: string;
  plan: 'free' | 'verified' | 'pro';
  logoUrl?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
}

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    kind: 'development',
    title: 'Chisholm Creek Phase 3 breaks ground - 200,000 sqft mixed-use expansion',
    location: 'Chisholm Creek, Edmond',
    address: 'Chisholm Creek Parkway, Edmond, OK',
    lat: 35.6395,
    lng: -97.4787,
    date: '2024-11-01',
    summary: 'Major expansion includes upscale retail anchor, 15 boutique retail spaces, and two restaurants. Project valued at $45M with completion targeted for Q4 2025. Expected to bring 200+ jobs to north OKC metro.',
    source: 'Journal Record',
    sourceUrl: 'https://journalrecord.com',
    tags: ['retail', 'edmond', 'mixed-use'],
    imageUrl: '/images/chisholm-creek.jpg',
  },
  {
    id: '2',
    kind: 'opening',
    title: 'Revive MedSpa opens third Oklahoma City location',
    location: 'The District, OKC',
    address: '13921 N Pennsylvania Ave, Oklahoma City, OK',
    lat: 35.6173,
    lng: -97.5464,
    date: '2024-10-28',
    summary: '5,000 sqft state-of-the-art facility offering IV therapy, medical aesthetics, and wellness services. The expansion brings 12 new healthcare jobs and serves growing demand in north OKC.',
    source: 'Community Submission',
    tags: ['wellness', 'healthcare', 'okc'],
    imageUrl: '/images/revive-medspa.jpg',
  },
  {
    id: '3',
    kind: 'expansion',
    title: 'Paycom expands downtown campus with new 20-story tower',
    location: 'Downtown OKC',
    address: '2501 N Shartel Ave, Oklahoma City, OK',
    lat: 35.4959,
    lng: -97.5272,
    date: '2024-10-25',
    summary: 'Oklahoma City-based Paycom announces $150M expansion adding 500,000 sqft of office space and capacity for 1,000 additional employees. Tower design features modern architecture and sustainable building practices.',
    source: 'The Oklahoman',
    sourceUrl: 'https://oklahoman.com',
    tags: ['tech', 'downtown', 'expansion', 'jobs'],
  },
  {
    id: '4',
    kind: 'opening',
    title: 'Dunkin\' announces 5 new Oklahoma City metro locations',
    location: 'OKC Metro',
    date: '2024-10-22',
    summary: 'National coffee chain plans aggressive expansion with locations in Edmond, Norman, Yukon, and two in Oklahoma City. Each location will create 15-20 jobs with grand openings scheduled through early 2025.',
    source: 'Press Release',
    tags: ['food-beverage', 'franchise', 'metro'],
  },
  {
    id: '5',
    kind: 'development',
    title: 'Wheeler District adds luxury apartment tower and boutique hotel',
    location: 'Wheeler District, OKC',
    address: 'SW 10th St & Robinson Ave, Oklahoma City, OK',
    lat: 35.4631,
    lng: -97.5196,
    date: '2024-10-20',
    summary: '18-story mixed-use tower featuring 200 luxury apartments, 120-room boutique hotel, and ground-floor retail. Part of ongoing $500M Wheeler District transformation. Opens summer 2026.',
    source: 'Journal Record',
    sourceUrl: 'https://journalrecord.com',
    tags: ['residential', 'hospitality', 'downtown', 'wheeler'],
  },
  {
    id: '6',
    kind: 'opening',
    title: 'Native Roots Market opens in Plaza District',
    location: 'Plaza District, OKC',
    address: '1628 NW 16th St, Oklahoma City, OK',
    lat: 35.4894,
    lng: -97.5243,
    date: '2024-10-18',
    summary: 'New locally-owned grocery concept featuring Oklahoma-grown produce, local meat and dairy, and artisan goods. 3,000 sqft space with community gathering area and cooking classes.',
    source: 'Community Submission',
    tags: ['retail', 'food', 'plaza-district', 'local'],
  },
  {
    id: '7',
    kind: 'event',
    title: 'OKC Innovation District hosts annual Startup Showcase',
    location: 'Innovation District, OKC',
    address: 'Oklahoma Health Center, Oklahoma City, OK',
    date: '2024-10-15',
    summary: '50+ Oklahoma startups pitch to investors at annual showcase. Event features keynote from local tech leaders, networking sessions, and $100K pitch competition. Free to attend with registration.',
    source: 'Event Listing',
    sourceUrl: 'https://okcinnovation.com',
    tags: ['tech', 'startup', 'event', 'innovation'],
  },
  {
    id: '8',
    kind: 'expansion',
    title: 'Love\'s Travel Stops announces $200M headquarters expansion',
    location: 'Northwest OKC',
    date: '2024-10-12',
    summary: 'Oklahoma City-based Love\'s expands corporate campus with new 150,000 sqft office building. Project brings 300 corporate jobs and reinforces Love\'s commitment to OKC as headquarters city.',
    source: 'The Oklahoman',
    sourceUrl: 'https://oklahoman.com',
    tags: ['corporate', 'expansion', 'jobs'],
  },
  {
    id: '9',
    kind: 'opening',
    title: 'The Jones Assembly 2.0 - sister venue opens in Automobile Alley',
    location: 'Automobile Alley, OKC',
    address: 'N Broadway Ave, Oklahoma City, OK',
    lat: 35.4745,
    lng: -97.5152,
    date: '2024-10-10',
    summary: '10,000 sqft live music venue, restaurant, and bar from team behind The Jones Assembly. Features rooftop patio, full kitchen, and 500-person capacity event space.',
    source: 'Community Submission',
    tags: ['hospitality', 'entertainment', 'auto-alley'],
  },
  {
    id: '10',
    kind: 'data-insight',
    title: 'OKC commercial real estate sees 15% rent growth in Q3 2024',
    location: 'OKC Metro',
    date: '2024-10-08',
    summary: 'New data shows Oklahoma City commercial rents up 15% YoY, with retail spaces in Midtown and Automobile Alley leading growth. Office vacancy rates down to 8%, lowest since 2019.',
    source: 'NAI Sullivan Group Report',
    tags: ['data', 'real-estate', 'commercial'],
  },
  {
    id: '11',
    kind: 'development',
    title: 'First National Center redevelopment reaches 50% leased',
    location: 'Downtown OKC',
    address: '120 N Robinson Ave, Oklahoma City, OK',
    lat: 35.4684,
    lng: -97.5164,
    date: '2024-10-05',
    summary: 'Historic 33-story tower conversion to apartments hits milestone with 125 of 250 units leased. Retail spaces filling fast with local coffee shop and fitness studio confirmed.',
    source: 'Journal Record',
    tags: ['residential', 'downtown', 'historic'],
  },
  {
    id: '12',
    kind: 'opening',
    title: 'Scissortail Park announces new food hall for 2025',
    location: 'Scissortail Park, OKC',
    address: 'SW 7th St, Oklahoma City, OK',
    lat: 35.4655,
    lng: -97.5115,
    date: '2024-10-03',
    summary: '8,000 sqft food hall featuring 10 local vendors, outdoor seating for 200, and connection to park trails. Designed to activate southwest corner of park year-round.',
    source: 'Press Release',
    tags: ['food-beverage', 'downtown', 'park'],
  },
  {
    id: '13',
    kind: 'expansion',
    title: 'Stonecloud Brewing doubles production capacity',
    location: 'Capitol Hill, OKC',
    address: 'S Robinson Ave, Oklahoma City, OK',
    date: '2024-09-30',
    summary: 'Oklahoma City\'s fastest-growing brewery adds 10,000 sqft production facility and canning line. Expansion enables distribution to Tulsa and Northwest Arkansas markets.',
    source: 'Community Submission',
    tags: ['manufacturing', 'beverage', 'capitol-hill'],
  },
  {
    id: '14',
    kind: 'opening',
    title: 'Factory Obscura opens permanent immersive art experience',
    location: 'Automobile Alley, OKC',
    address: 'NE 2nd St, Oklahoma City, OK',
    lat: 35.4708,
    lng: -97.5148,
    date: '2024-09-28',
    summary: '20,000 sqft interactive art installation replacing pop-up model. Features rotating exhibits, local artist collaborations, and event spaces. Already selling out weekend slots.',
    source: 'The Oklahoman',
    tags: ['arts', 'entertainment', 'auto-alley'],
  },
  {
    id: '15',
    kind: 'development',
    title: 'Midtown Renaissance adds 300-unit apartment complex',
    location: 'Midtown, OKC',
    address: 'N Walker Ave, Oklahoma City, OK',
    lat: 35.4828,
    lng: -97.5167,
    date: '2024-09-25',
    summary: 'Six-story mixed-use building breaks ground with apartments, ground-floor retail, and parking garage. Designed to connect Midtown\'s east and west sides. Completion late 2025.',
    source: 'Journal Record',
    tags: ['residential', 'midtown', 'mixed-use'],
  },
  {
    id: '16',
    kind: 'opening',
    title: 'INTEGRIS Health opens $50M cancer center in Edmond',
    location: 'Edmond, OK',
    date: '2024-09-22',
    summary: '75,000 sqft comprehensive cancer treatment facility featuring radiation oncology, infusion center, and survivorship programs. Brings advanced care closer to north metro residents.',
    source: 'Press Release',
    tags: ['healthcare', 'edmond', 'medical'],
  },
  {
    id: '17',
    kind: 'expansion',
    title: 'Eskimo Joe\'s OKC location plans second floor expansion',
    location: 'Bricktown, OKC',
    address: 'E Sheridan Ave, Oklahoma City, OK',
    date: '2024-09-20',
    summary: 'Popular Stillwater-based restaurant adds rooftop patio and private event space. Investment of $1.2M doubles seating capacity and adds full bar.',
    source: 'Community Submission',
    tags: ['hospitality', 'bricktown', 'expansion'],
  },
  {
    id: '18',
    kind: 'data-insight',
    title: 'OKC sees 12% population growth in 18-34 demographic',
    location: 'OKC Metro',
    date: '2024-09-18',
    summary: 'New census estimates show Oklahoma City attracting young professionals at accelerating rate. Growth concentrated in urban core neighborhoods: Midtown, Plaza, Deep Deuce.',
    source: 'U.S. Census Bureau',
    tags: ['data', 'demographics', 'growth'],
  },
  {
    id: '19',
    kind: 'opening',
    title: 'Whole Foods Market confirms 2025 opening in Classen Curve',
    location: 'Classen Curve, OKC',
    address: 'Grand Blvd, Oklahoma City, OK',
    lat: 35.5456,
    lng: -97.5394,
    date: '2024-09-15',
    summary: '45,000 sqft flagship store will be second Oklahoma location. Features prepared foods, outdoor seating, and beer/wine bar. Opens spring 2025.',
    source: 'Press Release',
    tags: ['retail', 'food', 'classen-curve'],
  },
  {
    id: '20',
    kind: 'event',
    title: 'OKC DealSprints Network Launch Event - November 15',
    location: 'The Haunted House, OKC',
    address: '739 NW 1st St, Oklahoma City, OK',
    date: '2024-11-15',
    summary: 'Official launch of DealSprints OKC Network. Mix and mingle with local business owners, investors, and developers. Featuring lightning talks, networking, and pulse feed preview. RSVP required.',
    source: 'DealSprints',
    sourceUrl: 'https://dealsprints.com/okc/events',
    tags: ['event', 'networking', 'dealsprints'],
  },
];

export const MOCK_MEMBERS: Member[] = [
  {
    slug: 'revive-medspa-okc',
    businessName: 'Revive MedSpa',
    ownerName: 'Dr. Sarah Johnson',
    category: 'Wellness & Healthcare',
    tagline: 'IV Therapy, Medical Aesthetics & Wellness',
    bio: 'Oklahoma City\'s premier medical spa offering cutting-edge IV therapy, aesthetic treatments, and personalized wellness programs. Three locations serving the metro.',
    plan: 'verified',
    logoUrl: '/logos/revive.png',
    website: 'https://revivemedspa.com',
    instagram: '@revivemedspaokc',
    email: 'hello@revivemedspa.com',
    phone: '(405) 555-0123',
    address: '13921 N Pennsylvania Ave, Oklahoma City, OK 73134',
    isActive: true,
  },
  {
    slug: 'native-roots-market',
    businessName: 'Native Roots Market',
    ownerName: 'Michael Torres',
    category: 'Retail & Food',
    tagline: 'Oklahoma-Grown Groceries & Local Goods',
    bio: 'Community-focused grocery featuring 100% Oklahoma-sourced produce, meats, dairy, and artisan products. Supporting local farmers and producers.',
    plan: 'verified',
    logoUrl: '/logos/native-roots.png',
    website: 'https://nativerootsokc.com',
    instagram: '@nativerootsokc',
    address: '1628 NW 16th St, Oklahoma City, OK 73106',
    isActive: true,
  },
  {
    slug: 'stonecloud-brewing',
    businessName: 'Stonecloud Brewing Co.',
    ownerName: 'Joel Irby',
    category: 'Food & Beverage',
    tagline: 'Craft Beer Brewed in OKC',
    bio: 'Oklahoma City\'s award-winning craft brewery. Known for innovative IPAs and community-focused taproom. Now distributing across Oklahoma and beyond.',
    plan: 'pro',
    logoUrl: '/logos/stonecloud.png',
    website: 'https://stonecloudbrewing.com',
    instagram: '@stonecloudbrewing',
    facebook: 'stonecloudbrewing',
    address: '1248 S Robinson Ave, Oklahoma City, OK 73109',
    isActive: true,
  },
  {
    slug: 'factory-obscura',
    businessName: 'Factory Obscura',
    ownerName: 'Lauren Jochum & Kelsey Karper',
    category: 'Arts & Entertainment',
    tagline: 'Immersive Art Experiences',
    bio: 'Oklahoma City\'s premier interactive art installation. Permanent home for rotating immersive exhibits featuring local and national artists.',
    plan: 'verified',
    logoUrl: '/logos/factory-obscura.png',
    website: 'https://factoryobscura.com',
    instagram: '@factoryobscura',
    address: 'NE 2nd St, Oklahoma City, OK 73104',
    isActive: true,
  },
  {
    slug: 'oak-property-group',
    businessName: 'Oak Property Group',
    ownerName: 'Jennifer Martinez',
    category: 'Real Estate',
    tagline: 'Commercial Real Estate Development',
    bio: 'Leading OKC commercial developer specializing in mixed-use projects, retail centers, and urban infill. 20+ years transforming Oklahoma City.',
    plan: 'pro',
    logoUrl: '/logos/oak-property.png',
    website: 'https://oakpropertygroup.com',
    linkedin: 'company/oak-property-group',
    email: 'info@oakpropertygroup.com',
    phone: '(405) 555-0199',
    isActive: true,
  },
  {
    slug: 'prairie-tech-solutions',
    businessName: 'Prairie Tech Solutions',
    ownerName: 'David Chen',
    category: 'Technology',
    tagline: 'Software Development & IT Consulting',
    bio: 'Full-service software development and IT consulting for Oklahoma businesses. Specializing in custom applications, cloud migration, and cybersecurity.',
    plan: 'verified',
    logoUrl: '/logos/prairie-tech.png',
    website: 'https://prairietech.io',
    linkedin: 'company/prairie-tech',
    address: 'Downtown OKC',
    isActive: true,
  },
  {
    slug: 'capitol-hill-coffee',
    businessName: 'Capitol Hill Coffee Co.',
    ownerName: 'Maria Rodriguez',
    category: 'Food & Beverage',
    tagline: 'Neighborhood Coffee & Community Hub',
    bio: 'Family-owned coffee shop serving Capitol Hill. Sourcing beans from sustainable farms, baking fresh daily, and creating community gathering space.',
    plan: 'free',
    logoUrl: '/logos/capitol-hill-coffee.png',
    instagram: '@capitolhillcoffee',
    address: '700 S Walker Ave, Oklahoma City, OK 73109',
    isActive: true,
  },
  {
    slug: 'okc-metro-roofing',
    businessName: 'OKC Metro Roofing',
    ownerName: 'James Thompson',
    category: 'Construction & Trades',
    tagline: 'Commercial & Residential Roofing',
    bio: 'Trusted roofing contractor serving Oklahoma City for 15 years. Commercial, residential, and storm restoration services.',
    plan: 'free',
    website: 'https://okcmetroroofing.com',
    phone: '(405) 555-0145',
    isActive: true,
  },
  {
    slug: 'midtown-pilates-studio',
    businessName: 'Midtown Pilates Studio',
    ownerName: 'Ashley Williams',
    category: 'Wellness & Fitness',
    tagline: 'Reformer Pilates & Wellness',
    bio: 'Boutique Pilates studio in the heart of Midtown OKC. Small group classes, private sessions, and wellness workshops.',
    plan: 'verified',
    logoUrl: '/logos/midtown-pilates.png',
    website: 'https://midtownpilatesokc.com',
    instagram: '@midtownpilatesokc',
    address: 'N Walker Ave, Oklahoma City, OK 73103',
    isActive: true,
  },
  {
    slug: 'frontier-digital-marketing',
    businessName: 'Frontier Digital Marketing',
    ownerName: 'Ryan Patterson',
    category: 'Marketing & Media',
    tagline: 'Digital Marketing for Local Businesses',
    bio: 'Full-service digital agency specializing in SEO, social media, and PPC for Oklahoma businesses. Helping local brands grow online.',
    plan: 'pro',
    logoUrl: '/logos/frontier-digital.png',
    website: 'https://frontierdigital.co',
    linkedin: 'company/frontier-digital',
    instagram: '@frontierdigitalokc',
    isActive: true,
  },
  {
    slug: 'the-loaded-bowl',
    businessName: 'The Loaded Bowl',
    ownerName: 'Jessica Kim',
    category: 'Food & Beverage',
    tagline: 'Fresh Poke & Acai Bowls',
    bio: 'Fast-casual concept serving fresh poke bowls, acai bowls, and smoothies. Made-to-order with high-quality ingredients. Now franchising across Oklahoma.',
    plan: 'verified',
    logoUrl: '/logos/loaded-bowl.png',
    website: 'https://theloadedbowl.com',
    instagram: '@theloadedbowl',
    address: 'Multiple OKC Locations',
    isActive: true,
  },
  {
    slug: 'thunder-valley-landscaping',
    businessName: 'Thunder Valley Landscaping',
    ownerName: 'Robert Nguyen',
    category: 'Construction & Trades',
    tagline: 'Commercial Landscaping & Design',
    bio: 'Premier commercial landscaping serving OKC metro. Specializing in corporate campuses, retail centers, and HOA communities.',
    plan: 'free',
    website: 'https://thundervalleyland.com',
    phone: '(405) 555-0178',
    isActive: true,
  },
];

// Filter helpers
export function getPostsByKind(kind: Post['kind']) {
  return MOCK_POSTS.filter(post => post.kind === kind);
}

export function getPostsByTag(tag: string) {
  return MOCK_POSTS.filter(post => post.tags.includes(tag));
}

export function getRecentPosts(limit: number = 10) {
  return MOCK_POSTS.slice(0, limit);
}

export function getMembersByPlan(plan: Member['plan']) {
  return MOCK_MEMBERS.filter(member => member.plan === plan && member.isActive);
}

export function getVerifiedMembers() {
  return MOCK_MEMBERS.filter(m => m.plan !== 'free' && m.isActive);
}

export function getMemberBySlug(slug: string) {
  return MOCK_MEMBERS.find(member => member.slug === slug);
}

export function getPostById(id: string) {
  return MOCK_POSTS.find(post => post.id === id);
}

// Stats for homepage
export function getStats() {
  return {
    totalPosts: MOCK_POSTS.length,
    totalMembers: MOCK_MEMBERS.filter(m => m.isActive).length,
    verifiedMembers: getVerifiedMembers().length,
    thisWeekPosts: MOCK_POSTS.filter(p => {
      const postDate = new Date(p.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return postDate >= weekAgo;
    }).length,
  };
}

