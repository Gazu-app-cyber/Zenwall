import WallpaperCard from "@/components/WallpaperCard";

export default function WallpaperGrid({ wallpapers, onPreview }) {
  if (!wallpapers.length) {
    return (
      <div className="container empty-state">
        <h2>Nenhum wallpaper encontrado</h2>
        <p>Tente outra busca ou categoria.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="wallpaper-grid">
        {wallpapers.map((wallpaper) => (
          <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} onPreview={onPreview} />
        ))}
      </div>
    </div>
  );
}
