import { slugify } from "@/utils/formatters";

export default function WallpaperCard({ wallpaper, onPreview }) {
  const handleDownload = async (event) => {
    event.stopPropagation();
    const response = await fetch(wallpaper.url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${slugify(wallpaper.title)}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  };

  return (
    <article className="wallpaper-card" onClick={() => onPreview(wallpaper)} aria-hidden="true">
      <img className="wallpaper-card__image" src={wallpaper.thumbnailUrl} alt={wallpaper.title} />
      <div className="wallpaper-card__overlay">
        <div>
          <h3>{wallpaper.title}</h3>
          <p>{wallpaper.author}</p>
        </div>
        <div className="wallpaper-card__actions">
          <button type="button" className="button button--soft" onClick={handleDownload}>
            Baixar
          </button>
          <button type="button" className="button button--soft" onClick={() => onPreview(wallpaper)}>
            Ver
          </button>
        </div>
      </div>
    </article>
  );
}
