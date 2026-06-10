import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow:    ["/", "/about", "/auth", "/privacy", "/terms"],
      disallow: ["/dashboard", "/interview", "/results", "/api"],
    },
    sitemap: "https://getroundone.vercel.app/sitemap.xml",
  };
}
