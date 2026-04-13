import { useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdModal from "@/components/AdModal";
import { createFolderRecord, getFoldersByUser } from "@/services/storage/folderStorage";
import { saveWallpaperRecord } from "@/services/storage/savedWallpapersStorage";

const palette = ["#7c3aed", "#db2777", "#ea580c", "#16a34a", "#0284c7", "#d97706"];

export default function SaveButton({ wallpaper, usageHook }) {
  const { user, openAuthModal } = useAuth();
  const [folderId, setFolderId] = useState("all");
  const [showAdModal, setShowAdModal] = useState(false);

  const folders = useMemo(() => (user ? getFoldersByUser(user.email) : []), [user]);

  const handleSave = () => {
    if (!user) {
      openAuthModal();
      return;
    }

    const saveResult = usageHook.consumeSave();
    if (!saveResult.ok && saveResult.reason === "AD_REQUIRED") {
      setShowAdModal(true);
      return;
    }

    if (!saveResult.ok) {
      window.alert("Nao foi possivel salvar agora.");
      return;
    }

    saveWallpaperRecord({
      userEmail: user.email,
      wallpaperId: wallpaper.id,
      wallpaperTitle: wallpaper.title,
      wallpaperThumb: wallpaper.thumbnailUrl,
      wallpaperUrl: wallpaper.imageUrl,
      wallpaperAuthor: wallpaper.author,
      folderId,
    });

    window.alert("Wallpaper salvo com sucesso.");
  };

  const handleQuickFolder = () => {
    if (!user) return;
    const name = window.prompt("Nome da pasta");
    if (!name) return;
    const color = palette[Math.floor(Math.random() * palette.length)];
    const folder = createFolderRecord({ userEmail: user.email, name, color });
    setFolderId(folder.id);
  };

  return (
    <>
      <div className="save-panel">
        <select value={folderId} onChange={(event) => setFolderId(event.target.value)}>
          <option value="all">Todos</option>
          {folders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>
        <button type="button" className="button button--ghost" onClick={handleQuickFolder}>
          Nova pasta
        </button>
        <button type="button" className="button button--primary" onClick={handleSave}>
          Salvar wallpaper
        </button>
      </div>
      <AdModal
        open={showAdModal}
        onClose={() => setShowAdModal(false)}
        onReward={() => {
          usageHook.grantAdReward();
          window.alert("Credito extra liberado. Agora voce pode salvar mais um wallpaper.");
        }}
      />
    </>
  );
}
