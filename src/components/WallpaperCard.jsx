import { Download } from "lucide-react";

export default function WallpaperCard({ wallpaper, onPreview }) {
  return (
    <article className="group overflow-hidden rounded-[1.7rem] border border-white/8 bg-card/70 shadow-[0_22px_40px_rgba(0,0,0,0.28)]">
      <button onClick={() => onPreview(wallpaper)} className="block w-full text-left">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={wallpaper.thumbnailUrl}
            alt={wallpaper.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-60" />
        </div>
        <div className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="line-clamp-1 font-heading text-lg font-semibold text-white">{wallpaper.title}</h3>
              <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{wallpaper.author}</p>
            </div>
            <span className="rounded-full border border-white/8 bg-background/80 px-2.5 py-1 text-[11px] capitalize text-muted-foreground">
              {wallpaper.category}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{wallpaper.source}</span>
            <span className="inline-flex items-center gap-1">
              <Download className="h-3.5 w-3.5" />
              Download
            </span>
          </div>
        </div>
      </button>
    </article>
  );
}
