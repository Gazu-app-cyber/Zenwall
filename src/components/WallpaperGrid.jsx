import WallpaperCard from "@/components/WallpaperCard";

export default function WallpaperGrid({ wallpapers, loading, onPreview }) {
  if (loading && wallpapers.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="aspect-[9/16] animate-pulse rounded-[1.75rem] bg-card" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
      {wallpapers.map((wallpaper) => (
        <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} onPreview={onPreview} />
      ))}
    </div>
  );
}
