import { Download } from "lucide-react";

export default function WallpaperCard({ wallpaper, onPreview }) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-border/50 bg-card/70 shadow-lg shadow-black/10">
      <button onClick={() => onPreview(wallpaper)} className="block w-full text-left">
        <div className="aspect-[9/16] overflow-hidden">
          <img src={wallpaper.thumbnailUrl} alt={wallpaper.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
        </div>
        <div className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="line-clamp-1 font-heading text-base font-semibold">{wallpaper.title}</h3>
              <p className="line-clamp-1 text-xs text-muted-foreground">{wallpaper.author}</p>
            </div>
            <span className="rounded-full border border-border/60 bg-background/70 px-2.5 py-1 text-[11px] uppercase text-muted-foreground">
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
