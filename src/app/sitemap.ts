import type { MetadataRoute } from "next";
import { createAnonClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://doislabs.com.br";

  const supabase = createAnonClient();
  const { data: products } = await supabase
    .from("products")
    .select("slug, created_at")
    .eq("is_active", true);

  const productUrls = (products ?? []).map((p) => ({
    url: `${baseUrl}/produtos/${p.slug}`,
    lastModified: new Date(p.created_at),
  }));

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/produtos`, lastModified: new Date() },
    { url: `${baseUrl}/sobre`, lastModified: new Date() },
    ...productUrls,
  ];
}
