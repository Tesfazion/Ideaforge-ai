import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:1212";
  const now = new Date();

  const staticRoutes = [
    "",
    "about",
    "blog",
    "careers",
    "contact",
    "status",
    "changelog",
    "privacy-policy",
    "terms-of-service",
    "cookie-policy",
    "gdpr",
    "login",
    "register",
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}/${route}`,
    lastModified: now,
    changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "" ? 1 : 0.7,
  }));
}
