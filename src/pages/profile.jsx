import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, FolderPlus, Bookmark, Crown, LogOut, Trash2, X, AlertTriangle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useUserUsage } from "@/hooks/useUserUsage";
import { getTodayBrasilia } from "@/lib/brasilia";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const FOLDER_COLORS = ["#7c3aed", "#db2777", "#ea580c", "#16a34a", "#0284c7", "#d97706"];

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const usageHook = useUserUsage(user);
  const [folders, setFolders] = useState([]);
  const [savedWallpapers, setSavedWallpapers] = useState([]);
  const [activeFolder, setActiveFolder] = useState("all");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState(FOLDER_COLORS[0]);
  const [loading, setLoading] = useState(true);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const fetchData = useCallback(async () => {
    if (!user) return;
    const [foldersRes, savedRes] = await Promise.all([
      base44.entities.Folder.filter({ user_email: user.email }),
      base44.entities.SavedWallpaper.filter({ user_email: user.email }),
    ]);
    setFolders(foldersRes);
    setSavedWallpapers(savedRes);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user) { navigate("/"); return; }
    fetchData();
  }, [user, fetchData, navigate]);

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    const folder = await base44.entities.Folder.create({
      user_email: user.email,
      name: newFolderName.trim(),
      color: newFolderColor,
    });
    setFolders((f) => [...f, folder]);
    setNewFolderName("");
    setShowNewFolder(false);
    toast.success("Pasta criada!");
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== user.email) return;
    // Delete all user data
    await Promise.all([
      ...savedWallpapers.map((w) => base44.entities.SavedWallpaper.delete(w.id)),
      ...folders.map((f) => base44.entities.Folder.delete(f.id)),
    ]);
    base44.auth.logout("/");
  };

  const deleteFolder = async (folderId) => {
    await base44.entities.Folder.delete(folderId);
    setFolders((f) => f.filter((x) => x.id !== folderId));
    if (activeFolder === folderId) setActiveFolder("all");
  };

  const removeSaved = async (savedId) => {
    await base44.entities.SavedWallpaper.delete(savedId);
    setSavedWallpapers((s) => s.filter((x) => x.id !== savedId));
    toast.success("Wallpaper removido");
  };

  const filteredWallpapers = activeFolder === "all"
    ? savedWallpapers
    : savedWallpapers.filter((w) => w.folder_id === activeFolder);

  const isPremium = user?.is_premium || usageHook.isPremium();
  const savesCount = usageHook.getSavesCount();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-body transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Explorar
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDeleteAccount(true)}
              className="flex items-center gap-2 text-destructive/70 hover:text-destructive text-xs font-body transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Excluir conta</span>
            </button>
            <button
              onClick={() => base44.auth.logout("/")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-body transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>

        {/* User info */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-heading font-bold text-primary">
            {user.full_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-xl font-bold">{user.full_name || user.email}</h1>
              {isPremium && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-500 text-xs font-body">
                  <Crown className="w-3 h-3" />
                  Premium
                </span>
              )}
            </div>
            <p className="font-body text-sm text-muted-foreground">{user.email}</p>
          </div>
          {!isPremium && (
            <Link
              to="/premium"
              className="ml-auto flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl text-primary text-sm font-body hover:bg-primary/20 transition-all"
            >
              <Crown className="w-4 h-4" />
              Assinar Premium
            </Link>
          )}
        </div>

        {/* Usage stats */}
        {!isPremium && (
          <div className="bg-card border border-border/30 rounded-2xl p-4 mb-8 flex items-center justify-between">
            <div>
              <p className="font-heading text-sm font-semibold">Saves hoje</p>
              <p className="font-body text-xs text-muted-foreground mt-0.5">Reset à meia-noite (Brasília) — {getTodayBrasilia()}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className={cn("w-3 h-3 rounded-full", i < savesCount ? "bg-primary" : "bg-secondary border border-border")} />
                ))}
              </div>
              <span className="font-heading text-sm font-bold">{savesCount}/3</span>
            </div>
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar - Folders */}
          <div className="w-56 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <p className="font-heading text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pastas</p>
              <button
                onClick={() => setShowNewFolder(true)}
                className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <FolderPlus className="w-3.5 h-3.5" />
              </button>
            </div>

            {showNewFolder && (
              <div className="bg-card border border-border/30 rounded-xl p-3 mb-3">
                <input
                  autoFocus
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && createFolder()}
                  placeholder="Nome da pasta"
                  className="w-full bg-secondary/50 border border-border/50 rounded-lg px-3 py-1.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 mb-2"
                />
                <div className="flex gap-1.5 mb-2">
                  {FOLDER_COLORS.map((c) => (
                    <button key={c} onClick={() => setNewFolderColor(c)} className={cn("w-5 h-5 rounded-full transition-transform", newFolderColor === c && "scale-125 ring-2 ring-white/30")} style={{ background: c }} />
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <button onClick={createFolder} className="flex-1 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-body hover:bg-primary/90 transition-all">Criar</button>
                  <button onClick={() => setShowNewFolder(false)} className="px-2 py-1.5 bg-secondary rounded-lg text-xs font-body text-muted-foreground hover:text-foreground transition-all"><X className="w-3 h-3" /></button>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <button
                onClick={() => setActiveFolder("all")}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-body transition-all text-left",
                  activeFolder === "all" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Bookmark className="w-3.5 h-3.5 shrink-0" />
                <span className="flex-1">Todos</span>
                <span className="text-xs opacity-60">{savedWallpapers.length}</span>
              </button>

              {folders.map((f) => (
                <div key={f.id} className="group flex items-center gap-1">
                  <button
                    onClick={() => setActiveFolder(f.id)}
                    className={cn(
                      "flex-1 flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-body transition-all text-left",
                      activeFolder === f.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: f.color }} />
                    <span className="flex-1 truncate">{f.name}</span>
                    <span className="text-xs opacity-60">{savedWallpapers.filter((w) => w.folder_id === f.id).length}</span>
                  </button>
                  <button onClick={() => deleteFolder(f.id)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Wallpapers grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-secondary rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : filteredWallpapers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Bookmark className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <p className="font-heading text-lg text-muted-foreground">Nenhum wallpaper salvo aqui</p>
                <p className="font-body text-sm text-muted-foreground/60 mt-1">Explore e salve seus favoritos</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredWallpapers.map((wp) => (
                  <div key={wp.id} className="group relative aspect-[3/4] rounded-2xl overflow-hidden">
                    <img src={wp.wallpaper_thumb} alt={wp.wallpaper_title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                      <p className="text-white text-xs font-heading font-semibold">{wp.wallpaper_title}</p>
                    </div>
                    <button
                      onClick={() => removeSaved(wp.id)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/50 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/80"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete account confirmation dialog */}
      {showDeleteAccount && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setShowDeleteAccount(false)}>
          <div className="bg-card border border-destructive/30 rounded-3xl p-8 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-destructive" />
            </div>
            <h2 className="font-heading text-xl font-bold text-center mb-2">Excluir conta</h2>
            <p className="font-body text-sm text-muted-foreground text-center mb-5">
              Isso apagará todos os seus dados permanentemente. Digite seu email para confirmar:
            </p>
            <input
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder={user.email}
              className="w-full bg-secondary/50 border border-border/50 rounded-xl px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-destructive/30 mb-3"
            />
            <button
              onClick={handleDeleteAccount}
              disabled={deleteConfirm !== user.email}
              className="w-full py-3 bg-destructive text-white rounded-xl font-body font-medium text-sm hover:bg-destructive/90 transition-all disabled:opacity-40"
            >
              Excluir permanentemente
            </button>
            <button onClick={() => setShowDeleteAccount(false)} className="w-full mt-2 py-2.5 text-sm text-muted-foreground font-body hover:text-foreground transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}