import { useState, useMemo, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useUserUsage } from "@/hooks/useUserUsage";
import Navbar from "@/components/NavbarOriginal";
import HeroSection from "@/components/HeroSectionOriginal";
import CategoryFilter from "@/components/CategoryFilterOriginal";
import WallpaperGrid from "@/components/WallpaperGridOriginal";
import WallpaperPreview from "@/components/WallpaperPreview";
import Footer from "@/components/Footer";
import { categories, wallpapers as staticWallpapers } from "@/lib/wallpapers";
import { useDynamicWallpapers } from "@/hooks/useDynamicWallpapers";
import PullToRefresh from "@/components/PullToRefresh";

export default function HomeOriginal() {
  const { user, openAuthModal } = useAuth();
  const { extra, loading: loadingMore, fetchMore, refresh } = useDynamicWallpapers();
  const usageHook = useUserUsage(user);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [previewWallpaper, setPreviewWallpaper] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("home_scroll");
    if (saved) window.scrollTo(0, Number.parseInt(saved, 10));
    const onUnload = () => sessionStorage.setItem("home_scroll", window.scrollY);
    window.addEventListener("pagehide", onUnload);
    return () => {
      sessionStorage.setItem("home_scroll", window.scrollY);
      window.removeEventListener("pagehide", onUnload);
    };
  }, []);

  const allWallpapers = useMemo(() => [...staticWallpapers, ...extra], [extra]);

  const handleScroll = useCallback(() => {
    if (loadingMore) return;
    const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 600;
    if (nearBottom) fetchMore(activeCategory);
  }, [loadingMore, fetchMore, activeCategory]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const filtered = useMemo(() => {
    let result = allWallpapers;

    if (activeCategory !== "all") {
      result = result.filter((wp) => wp.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (wp) =>
          wp.title.toLowerCase().includes(q) ||
          wp.category.toLowerCase().includes(q) ||
          wp.author.toLowerCase().includes(q)
      );
    }

    return result;
  }, [allWallpapers, activeCategory, searchQuery]);

  const handleRefresh = useCallback(async () => {
    await refresh(activeCategory);
  }, [refresh, activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAuthClick={() => openAuthModal()}
      />
      <HeroSection totalCount={allWallpapers.length} />
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />
      <PullToRefresh onRefresh={handleRefresh}>
        <WallpaperGrid wallpapers={filtered} onPreview={setPreviewWallpaper} />
        {loadingMore && (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          </div>
        )}
      </PullToRefresh>
      <Footer />

      {previewWallpaper && (
        <WallpaperPreview
          wallpaper={previewWallpaper}
          onClose={() => setPreviewWallpaper(null)}
          user={user}
          usageHook={usageHook}
        />
      )}
    </div>
  );
}
