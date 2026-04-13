import { useCallback, useEffect, useMemo, useState } from "react";
import CategoryFilter from "@/components/CategoryFilter";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import PullToRefresh from "@/components/PullToRefresh";
import WallpaperGrid from "@/components/WallpaperGrid";
import WallpaperPreview from "@/components/WallpaperPreview";
import { useDynamicWallpapers } from "@/hooks/useDynamicWallpapers";
import { useUserUsage } from "@/hooks/useUserUsage";
import { useAuth } from "@/lib/AuthContext";
import { categories } from "@/lib/wallpapers";

const HOME_STATE_KEY = "zenwall_home_state";

function loadHomeState() {
  if (typeof window === "undefined") return { searchQuery: "", activeCategory: "all", scrollY: 0 };
  try {
    const raw = window.sessionStorage.getItem(HOME_STATE_KEY);
    if (!raw) return { searchQuery: "", activeCategory: "all", scrollY: 0 };
    return { searchQuery: "", activeCategory: "all", scrollY: 0, ...JSON.parse(raw) };
  } catch {
    return { searchQuery: "", activeCategory: "all", scrollY: 0 };
  }
}

export default function Home() {
  const initial = loadHomeState();
  const { user, openAuthModal } = useAuth();
  const usageHook = useUserUsage(user);
  const { wallpapers, loading, loadingMore, fetchMore, refresh, error, sourceLabel } = useDynamicWallpapers(initial.activeCategory);
  const [searchQuery, setSearchQuery] = useState(initial.searchQuery);
  const [activeCategory, setActiveCategory] = useState(initial.activeCategory);
  const [previewWallpaper, setPreviewWallpaper] = useState(null);

  useEffect(() => {
    const persistState = () => {
      window.sessionStorage.setItem(
        HOME_STATE_KEY,
        JSON.stringify({ searchQuery, activeCategory, scrollY: window.scrollY })
      );
    };
    persistState();
    window.addEventListener("pagehide", persistState);
    return () => {
      persistState();
      window.removeEventListener("pagehide", persistState);
    };
  }, [searchQuery, activeCategory]);

  useEffect(() => {
    const saved = loadHomeState().scrollY;
    if (saved) {
      window.requestAnimationFrame(() => window.scrollTo(0, saved));
    }
  }, []);

  const filteredWallpapers = useMemo(() => {
    let list = wallpapers;
    if (activeCategory !== "all") {
      list = list.filter((item) => item.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase();
      list = list.filter((item) =>
        [item.title, item.author, item.category, item.source].filter(Boolean).join(" ").toLowerCase().includes(term)
      );
    }
    return list;
  }, [activeCategory, searchQuery, wallpapers]);

  const handleScroll = useCallback(() => {
    if (loadingMore) return;
    const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 900;
    if (nearBottom) fetchMore(activeCategory);
  }, [activeCategory, fetchMore, loadingMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleRefresh = useCallback(async () => {
    await refresh(activeCategory);
  }, [activeCategory, refresh]);

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-0">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onAuthClick={openAuthModal} />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-16 sm:px-6">
        <HeroSection totalCount={wallpapers.length} sourceLabel={sourceLabel} />
        <CategoryFilter categories={categories} activeCategory={activeCategory} onSelect={setActiveCategory} />
        <PullToRefresh onRefresh={handleRefresh}>
          {error && (
            <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-100">
              Nao foi possivel atualizar da web agora. O app segue mostrando a colecao local enquanto tenta novas fontes abertas.
            </div>
          )}
          <WallpaperGrid wallpapers={filteredWallpapers} loading={loading} onPreview={setPreviewWallpaper} />
          {loadingMore && (
            <div className="flex justify-center py-8">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
            </div>
          )}
        </PullToRefresh>
      </main>
      <Footer />
      {previewWallpaper && <WallpaperPreview wallpaper={previewWallpaper} onClose={() => setPreviewWallpaper(null)} usageHook={usageHook} user={user} />}
    </div>
  );
}
