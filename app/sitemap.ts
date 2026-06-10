import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://getroundone.vercel.app",        changeFrequency: "monthly", priority: 1 },
    { url: "https://getroundone.vercel.app/about",  changeFrequency: "monthly", priority: 0.8 },
    { url: "https://getroundone.vercel.app/auth",   changeFrequency: "yearly",  priority: 0.5 },
    { url: "https://getroundone.vercel.app/privacy", changeFrequency: "yearly", priority: 0.3 },
    { url: "https://getroundone.vercel.app/terms",  changeFrequency: "yearly",  priority: 0.3 },
  ];
}
