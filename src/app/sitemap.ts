import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const cities = ["dallas", "oklahoma-city", "austin", "houston", "san-antonio"];
  
  const urls = [
    { url: "https://dealsprints.com/", lastModified: new Date() },
    { url: "https://dealsprints.com/sell", lastModified: new Date() },
    { url: "https://dealsprints.com/buy", lastModified: new Date() },
    { url: "https://dealsprints.com/about", lastModified: new Date() },
    { url: "https://dealsprints.com/privacy", lastModified: new Date() },
    { url: "https://dealsprints.com/terms", lastModified: new Date() },
    ...cities.flatMap(city => [
      { url: `https://dealsprints.com/${city}/sell`, lastModified: new Date() },
      { url: `https://dealsprints.com/${city}/buy`, lastModified: new Date() },
    ]),
  ];
  
  return urls;
}
