import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import WallpaperGrid from "@/components/WallpaperGrid";
import WallpaperPreview from "@/components/WallpaperPreview";
import PullToRefresh from "@/components/PullToRefresh";
import Footer from "@/components/Footer";
import { categories } from "@/data/wallpapers";
import { useDynamicWallpapers } from "@/hooks/useDynamicWallpapers";
import { useAuth } from "@/hooks/useAuth";
import { useUserUsage } from "@/hooks/useUserUsage";

export default function HomePage() {
  const { user } = useAuth();
  const usageHook = useUserUsage(user);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [previewWallpaper, setPreviewWallpaper] = useState(null);
  const { wallpapers, loading, loadingMore, error, fetchMore, refresh } = useDynamicWallpapers(activeCategory);

  useEffect(() => {
    const onScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 600;
      if (nearBottom && !loadingMore) {
        void fetchMore();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [fetchMore, loadingMore]);

  const filteredWallpapers = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) return wallpapers;

    return wallpapers.filter((item) => {
      return (
        item.title.toLowerCase().includes(normalized) ||
        item.author.toLowerCase().includes(normalized) ||
        item.category.toLowerCase().includes(normalized)
      );
    });
  }, [searchQuery, wallpapers]);

  return (
    <div className="page page--home">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <HeroSection totalCount={wallpapers.length} />
      <CategoryFilter categories={categories} activeCategory={activeCategory} onSelect={setActiveCategory} />
      <PullToRefresh onRefresh={refresh}>
        {loading ? <div className="container status-block">Carregando wallpapers...</div> : null}
        {error ? <div className="container status-block">{error}</div> : null}
        <WallpaperGrid wallpapers={filteredWallpapers} onPreview={setPreviewWallpaper} />
        {loadingMore ? <div className="container status-block">Carregando mais...</div> : null}
      </PullToRefresh>
      <Footer />
      <WallpaperPreview wallpaper={previewWallpaper} onClose={() => setPreviewWallpaper(null)} usageHook={usageHook} />
    </div>
  );
}
