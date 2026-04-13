import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fallbackWallpapers, queryByCategory } from "@/lib/wallpapers";

const OPENVERSE_ENDPOINTS = [
  "https://api.openverse.engineering/v1/images/",
  "https://api.openverse.org/v1/images/",
];

function mapOpenverseResult(item, category) {
  return {
    id: item.id,
    title: item.title || "Wallpaper aberto",
    author: item.creator || item.provider || "Fonte aberta",
    category,
    source: item.source || item.provider || "Openverse",
    imageUrl: item.url,
    thumbnailUrl: item.thumbnail || item.url,
    width: item.width,
    height: item.height,
    orientation: item.height >= item.width ? "portrait" : "landscape",
    license: item.license?.toUpperCase() || "CC",
    licenseUrl: item.license_url,
    attribution: item.attribution,
    pageUrl: item.foreign_landing_url,
  };
}

async function fetchOpenversePage({ category, page, signal }) {
  const params = new URLSearchParams({
    q: queryByCategory[category] || queryByCategory.all,
    page: String(page),
    page_size: "24",
    license: "cc0,pdm",
    category: "photograph",
    aspect_ratio: "tall",
    mature: "false",
  });

  let lastError;
  for (const endpoint of OPENVERSE_ENDPOINTS) {
    try {
      const response = await fetch(`${endpoint}?${params.toString()}`, { signal });
      if (!response.ok) throw new Error(`HTTP_${response.status}`);
      const data = await response.json();
      return (data.results || [])
        .filter((item) => item.url && item.height && item.width)
        .map((item) => mapOpenverseResult(item, category === "all" ? "featured" : category));
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("OPENVERSE_UNAVAILABLE");
}

export function useDynamicWallpapers(initialCategory = "all") {
  const [wallpapers, setWallpapers] = useState(fallbackWallpapers);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [sourceLabel, setSourceLabel] = useState("Colecao aberta em tempo real");
  const pagesRef = useRef({ [initialCategory]: 0 });
  const seenIdsRef = useRef(new Set(fallbackWallpapers.map((item) => item.id)));
  const abortRef = useRef(null);

  const mergeWallpapers = useCallback((incoming) => {
    const unique = incoming.filter((item) => {
      if (seenIdsRef.current.has(item.id)) return false;
      seenIdsRef.current.add(item.id);
      return true;
    });
    if (unique.length) {
      setWallpapers((current) => [...current, ...unique]);
    }
  }, []);

  const fetchPage = useCallback(async (category, reset = false) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const nextPage = reset ? 1 : (pagesRef.current[category] || 0) + 1;
    const setLoadingState = reset ? setLoading : setLoadingMore;
    setLoadingState(true);
    setError(null);

    try {
      const nextItems = await fetchOpenversePage({
        category,
        page: nextPage,
        signal: abortRef.current.signal,
      });
      if (reset) {
        seenIdsRef.current = new Set(fallbackWallpapers.map((item) => item.id));
        setWallpapers(fallbackWallpapers);
      }
      mergeWallpapers(nextItems);
      pagesRef.current[category] = nextPage;
      setSourceLabel("Openverse com licencas abertas");
    } catch (fetchError) {
      if (fetchError.name !== "AbortError") {
        setError(fetchError);
        setSourceLabel("Colecao local com fallback aberto");
      }
    } finally {
      setLoadingState(false);
    }
  }, [mergeWallpapers]);

  useEffect(() => {
    fetchPage(initialCategory, true);
    return () => abortRef.current?.abort();
  }, [fetchPage, initialCategory]);

  const fetchMore = useCallback(async (category) => {
    if (!loadingMore) await fetchPage(category, false);
  }, [fetchPage, loadingMore]);

  const refresh = useCallback(async (category) => {
    await fetchPage(category, true);
  }, [fetchPage]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (wallpapers.length < 120) {
        fetchPage("all", false);
      }
    }, 30000);
    return () => window.clearInterval(interval);
  }, [fetchPage, wallpapers.length]);

  return useMemo(() => ({
    wallpapers,
    loading,
    loadingMore,
    error,
    sourceLabel,
    fetchMore,
    refresh,
  }), [error, fetchMore, loading, loadingMore, refresh, sourceLabel, wallpapers]);
}
