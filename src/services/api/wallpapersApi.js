import http from "@/services/api/http";
import { queryByCategory } from "@/data/wallpapers";

const endpoints = [
  "https://api.openverse.engineering/v1/images/",
  "https://api.openverse.org/v1/images/",
];

function mapResult(item, category) {
  return {
    id: item.id,
    title: item.title || "Wallpaper aberto",
    author: item.creator || item.provider || "Fonte aberta",
    category: category === "all" ? "featured" : category,
    source: item.source || item.provider || "Openverse",
    imageUrl: item.url,
    thumbnailUrl: item.thumbnail || item.url,
    url: item.url,
    thumb: item.thumbnail || item.url,
    width: item.width,
    height: item.height,
    license: item.license || "CC",
    licenseUrl: item.license_url || "",
    attribution: item.attribution || "",
    pageUrl: item.foreign_landing_url || "",
  };
}

export async function fetchWallpapersPage(category, page) {
  const params = {
    q: queryByCategory[category] || queryByCategory.all,
    page,
    page_size: 24,
    license: "cc0,pdm",
    category: "photograph",
    aspect_ratio: "tall",
    mature: false,
  };

  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      const response = await http.get(endpoint, { params });
      return (response.data.results || [])
        .filter((item) => item.url && item.width && item.height)
        .map((item) => mapResult(item, category));
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(lastError?.message || "Falha ao consultar wallpapers");
}
