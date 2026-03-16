import type { MetadataRoute } from "next";
import { subsidies } from "@/data/subsidies";
import { guides } from "@/data/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kyufunavi.toromonja.com";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/subsidy`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/diagnose`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/simulate`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/schedule`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/guide`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const subsidyPages: MetadataRoute.Sitemap = subsidies.map((s) => ({
    url: `${baseUrl}/subsidy/${s.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const guidePages: MetadataRoute.Sitemap = guides.map((g) => ({
    url: `${baseUrl}/guide/${g.slug}`,
    lastModified: g.updatedAt ? new Date(g.updatedAt) : new Date(g.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...subsidyPages, ...guidePages];
}
