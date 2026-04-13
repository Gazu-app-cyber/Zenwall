import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fallbackWallpapers } from "@/data/wallpapers";
import { fetchWallpapersPage } from "@/services/api/wallpapersApi";

export function useDynamicWallpapers(category = "all") {
  const [wallpapers, setWallpapers] = useState(fallbackWallpapers);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const pageRef = useRef({});
  const seenRef = useRef(new Set(fallbackWallpapers.map((item) => item.id)));

  const appendUnique = useCallback((items, reset = false) => {
    if (reset) {
      seenRef.current = new Set(fallbackWallpapers.map((item) => item.id));
      setWallpapers(fallbackWallpapers);
    }

    const nextItems = [];
    items.forEach((item) => {
      if (!seenRef.current.has(item.id)) {
        seenRef.current.add(item.id);
        nextItems.push(item);
      }
    });

    if (nextItems.length) {
      setWallpapers((current) => (reset ? [...fallbackWallpapers, ...nextItems] : [...current, ...nextItems]));
    }
  }, []);

  const loadPage = useCallback(
    async (nextCategory, reset = false) => {
      const nextPage = reset ? 1 : (pageRef.current[nextCategory] || 0) + 1;
      const setPending = reset ? setLoading : setLoadingMore;
      setPending(true);
      setError("");

      try {
        const items = await fetchWallpapersPage(nextCategory, nextPage);
        appendUnique(items, reset);
        pageRef.current[nextCategory] = nextPage;
      } catch (requestError) {
        setError(requestError.message || "Nao foi possivel carregar mais wallpapers.");
        if (reset) {
          setWallpapers(fallbackWallpapers);
        }
      } finally {
        setPending(false);
      }
    },
    [appendUnique]
  );

  useEffect(() => {
    loadPage(category, true);
  }, [category, loadPage]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (wallpapers.length < 120) {
        void loadPage(category, false);
      }
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, [category, loadPage, wallpapers.length]);

  const fetchMore = useCallback(async () => {
    if (!loadingMore) {
      await loadPage(category, false);
    }
  }, [category, loadPage, loadingMore]);

  const refresh = useCallback(async () => {
    await loadPage(category, true);
  }, [category, loadPage]);

  return useMemo(
    () => ({
      wallpapers,
      loading,
      loadingMore,
      error,
      fetchMore,
      refresh,
    }),
    [error, fetchMore, loading, loadingMore, refresh, wallpapers]
  );
}
