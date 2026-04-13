import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Eye, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export default function WallpaperCardOriginal({ wallpaper, onPreview, index }) {
  const [liked, setLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDownload = async (e) => {
    e.stopPropagation();
    const response = await fetch(wallpaper.url);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wallart-${wallpaper.title.toLowerCase().replace(/\s+/g, "-")}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative rounded-2xl overflow-hidden cursor-pointer bg-card border border-border/30"
      onClick={() => onPreview(wallpaper)}
    >
      {!imageLoaded && <div className="absolute inset-0 bg-secondary animate-pulse" />}

      <div className="aspect-[3/4] sm:aspect-[4/5]">
        <img
          src={wallpaper.thumb}
          alt={wallpaper.title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={cn(
            "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-white font-heading font-semibold text-sm mb-0.5">{wallpaper.title}</p>
        <p className="text-white/60 text-xs font-body">por {wallpaper.author}</p>
      </div>

      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all",
            liked ? "bg-red-500 text-white" : "bg-black/40 text-white hover:bg-black/60"
          )}
        >
          <Heart className={cn("w-4 h-4", liked && "fill-current")} />
        </button>
        <button
          onClick={handleDownload}
          className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
        >
          <Download className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPreview(wallpaper);
          }}
          className="w-9 h-9 rounded-xl bg-black/40 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/60 transition-all"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-white text-xs font-body">
          {wallpaper.category}
        </span>
      </div>
    </motion.div>
  );
}
