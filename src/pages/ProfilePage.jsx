import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserUsage } from "@/hooks/useUserUsage";
import { getTodayInBrasilia } from "@/utils/brasilia";
import { getInitials } from "@/utils/formatters";
import {
  createFolderRecord,
  deleteFolderRecord,
  getFoldersByUser,
} from "@/services/storage/folderStorage";
import {
  getSavedWallpapersByUser,
  removeSavedWallpaperRecord,
} from "@/services/storage/savedWallpapersStorage";

const folderColors = ["#7c3aed", "#db2777", "#ea580c", "#16a34a", "#0284c7", "#d97706"];

export default function ProfilePage() {
  const { user, logout, deleteAccount } = useAuth();
  const usageHook = useUserUsage(user);
  const [folders, setFolders] = useState([]);
  const [savedWallpapers, setSavedWallpapers] = useState([]);
  const [activeFolder, setActiveFolder] = useState("all");

  useEffect(() => {
    if (!user) return;
    setFolders(getFoldersByUser(user.email));
    setSavedWallpapers(getSavedWallpapersByUser(user.email));
  }, [user]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const reloadData = () => {
    setFolders(getFoldersByUser(user.email));
    setSavedWallpapers(getSavedWallpapersByUser(user.email));
  };

  const filteredWallpapers = useMemo(() => {
    if (activeFolder === "all") return savedWallpapers;
    return savedWallpapers.filter((item) => item.folderId === activeFolder);
  }, [activeFolder, savedWallpapers]);

  const handleCreateFolder = () => {
    const name = window.prompt("Nome da pasta");
    if (!name) return;
    const color = folderColors[Math.floor(Math.random() * folderColors.length)];
    createFolderRecord({ userEmail: user.email, name, color });
    reloadData();
  };

  const handleDeleteAccount = () => {
    const confirmation = window.prompt(`Digite ${user.email} para confirmar`);
    if (confirmation !== user.email) return;
    deleteAccount();
  };

  return (
    <div className="page">
      <div className="container profile-page">
        <div className="profile-page__header">
          <Link to="/" className="back-link">
            ← Explorar
          </Link>
          <div className="profile-page__header-actions">
            <button type="button" className="text-link text-link--danger" onClick={handleDeleteAccount}>
              Excluir conta
            </button>
            <button type="button" className="text-link" onClick={logout}>
              Sair
            </button>
          </div>
        </div>

        <section className="profile-card">
          <div className="profile-card__avatar">{getInitials(user.fullName, user.email)}</div>
          <div>
            <h1>{user.fullName || user.email}</h1>
            <p className="muted">{user.email}</p>
          </div>
          {!user.isPremium ? (
            <Link to="/premium" className="button button--ghost profile-card__premium">
              Assinar Premium
            </Link>
          ) : (
            <span className="premium-badge">Premium</span>
          )}
        </section>

        {!user.isPremium ? (
          <section className="usage-card">
            <div>
              <strong>Saves hoje</strong>
              <p className="muted">Reset a meia-noite (Brasilia) — {getTodayInBrasilia()}</p>
            </div>
            <div className="usage-card__meter">
              <span>{usageHook.getSavesCount()}/3</span>
            </div>
          </section>
        ) : null}

        <section className="profile-grid">
          <aside className="folders-panel">
            <div className="section-heading">
              <span>Pastas</span>
              <button type="button" className="icon-button" onClick={handleCreateFolder}>
                +
              </button>
            </div>

            <button
              type="button"
              className={activeFolder === "all" ? "folder-item folder-item--active" : "folder-item"}
              onClick={() => setActiveFolder("all")}
            >
              <span>Todos</span>
              <strong>{savedWallpapers.length}</strong>
            </button>

            {folders.map((folder) => (
              <div key={folder.id} className="folder-row">
                <button
                  type="button"
                  className={activeFolder === folder.id ? "folder-item folder-item--active" : "folder-item"}
                  onClick={() => setActiveFolder(folder.id)}
                >
                  <span className="folder-dot" style={{ backgroundColor: folder.color }} />
                  <span>{folder.name}</span>
                </button>
                <button
                  type="button"
                  className="icon-button icon-button--danger"
                  onClick={() => {
                    deleteFolderRecord(folder.id);
                    if (activeFolder === folder.id) setActiveFolder("all");
                    reloadData();
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </aside>

          <section className="saved-panel">
            {filteredWallpapers.length ? (
              <div className="saved-grid">
                {filteredWallpapers.map((item) => (
                  <article key={item.id} className="saved-card">
                    <img src={item.wallpaperThumb} alt={item.wallpaperTitle} />
                    <div className="saved-card__overlay">
                      <strong>{item.wallpaperTitle}</strong>
                      <button
                        type="button"
                        className="icon-button icon-button--danger"
                        onClick={() => {
                          removeSavedWallpaperRecord(item.id);
                          reloadData();
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h2>Nenhum wallpaper salvo aqui</h2>
                <p>Explore e salve seus favoritos.</p>
              </div>
            )}
          </section>
        </section>
      </div>
    </div>
  );
}
