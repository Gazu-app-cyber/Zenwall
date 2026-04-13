export default function AdModal({ open, onReward, onClose }) {
  if (!open) return null;

  const handleReward = () => {
    onReward();
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} aria-hidden="true">
      <div className="dialog" onClick={(event) => event.stopPropagation()} aria-hidden="true">
        <h3>Liberar mais um save</h3>
        <p>Simulacao de anuncio: clique abaixo para receber 1 credito extra de save.</p>
        <div className="dialog__actions">
          <button type="button" className="button button--ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="button button--primary" onClick={handleReward}>
            Assistir anuncio
          </button>
        </div>
      </div>
    </div>
  );
}
