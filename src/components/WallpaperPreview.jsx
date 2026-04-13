import { Download, ExternalLink, X } from "lucide-react";
import SaveButton from "@/components/SaveButton";

export default function WallpaperPreview({ wallpaper, onClose, usageHook }) {
  return (
    <div className="fixed inset-0 z-[110] bg-black/80 p-4 backdrop-blur-xl" onClick={onClose} aria-hidden="true">
      <div className="safe-bottom mx-auto flex h-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-border/50 bg-card shadow-2xl lg:grid lg:grid-cols-[1.1fr,0.9fr]" onClick={(event) => event.stopPropagation()}>
        <div className="relative min-h-[320px] bg-black">
          <img src={wallpaper.imageUrl} alt={wallpaper.title} className="h-full w-full object-cover" />
          <button onClick={onClose} className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-black/50 text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-col gap-5 p-5 sm:p-6">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary">{wallpaper.category}</p>
            <h2 className="font-heading text-2xl font-bold">{wallpaper.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {wallpaper.author} • {wallpaper.source}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <a href={wallpaper.imageUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">
              <Download className="h-4 w-4" />
              Baixar wallpaper
            </a>
            <SaveButton wallpaper={wallpaper} usageHook={usageHook} />
          </div>
          <div className="rounded-[1.75rem] border border-border/50 bg-background/50 p-4 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Licenca</p>
            <p className="mt-1">{wallpaper.license || "Consulte a fonte original"}</p>
            {wallpaper.attribution && <p className="mt-2 text-xs">{wallpaper.attribution}</p>}
            {wallpaper.pageUrl && (
              <a href={wallpaper.pageUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-primary">
                <ExternalLink className="h-4 w-4" />
                Ver fonte original
              </a>
            )}
          </div>
          <div className="rounded-[1.75rem] border border-border/50 bg-background/50 p-4 text-sm text-muted-foreground">
            Salve ate 3 wallpapers por dia no plano gratuito. Depois disso, um anuncio libera mais 1 save. No Premium, tudo fica ilimitado e sem anuncios.
          </div>
        </div>
      </div>
    </div>
  );
}
