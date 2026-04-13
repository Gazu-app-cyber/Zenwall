import SaveButton from "@/components/SaveButton";

export default function WallpaperPreview({ wallpaper, onClose, usageHook }) {
  if (!wallpaper) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} aria-hidden="true">
      <div className="preview-modal" onClick={(event) => event.stopPropagation()} aria-hidden="true">
        <div className="preview-modal__media">
          <img src={wallpaper.imageUrl} alt={wallpaper.title} />
          <button type="button" className="preview-modal__close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="preview-modal__content">
          <p className="eyebrow">{wallpaper.category}</p>
          <h2>{wallpaper.title}</h2>
          <p className="muted">
            {wallpaper.author} • {wallpaper.source}
          </p>
          <div className="preview-modal__actions">
            <a href={wallpaper.imageUrl} target="_blank" rel="noreferrer" className="button button--primary">
              Baixar wallpaper
            </a>
            <SaveButton wallpaper={wallpaper} usageHook={usageHook} />
          </div>
          <div className="info-box">
            <strong>Licenca</strong>
            <p>{wallpaper.license || "Consulte a fonte original"}</p>
          </div>
          <div className="info-box">
            <p>Plano gratuito: 3 saves por dia. Depois disso, um anuncio libera mais 1 save.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
