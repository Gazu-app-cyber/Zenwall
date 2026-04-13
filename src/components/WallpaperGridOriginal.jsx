import WallpaperCardOriginal from "./WallpaperCardOriginal";

export default function WallpaperGridOriginal({ wallpapers, onPreview }) {
  if (wallpapers.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="font-heading text-xl text-muted-foreground">Nenhum wallpaper encontrado</p>
        <p className="font-body text-sm text-muted-foreground/60 mt-2">Tente outra busca ou categoria</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {wallpapers.map((wp, i) => (
          <WallpaperCardOriginal
            key={wp.id}
            wallpaper={wp}
            onPreview={onPreview}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
