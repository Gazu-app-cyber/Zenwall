import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Bookmark, Crown, FolderPlus, LogOut, Trash2, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useUserUsage } from "@/hooks/useUserUsage";
import { getTodayBrasilia } from "@/lib/brasilia";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const FOLDER_COLORS = ["#7c3aed", "#db2777", "#ea580c", "#16a34a", "#0284c7", "#d97706"];

export default function ProfileModern() {
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
    if (!user) {
      navigate("/");
      return;
    }
    fetchData();
  }, [fetchData, navigate, user]);

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    const folder = await base44.entities.Folder.create({
      user_email: user.email,
      name: newFolderName.trim(),
      color: newFolderColor,
    });
    setFolders((current) => [...current, folder]);
    setNewFolderName("");
    setShowNewFolder(false);
    toast.success("Pasta criada!");
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== user.email) return;
    await Promise.all([
      ...savedWallpapers.map((wallpaper) => base44.entities.SavedWallpaper.delete(wallpaper.id)),
      ...folders.map((folder) => base44.entities.Folder.delete(folder.id)),
    ]);
    base44.auth.logout("/");
  };

  const deleteFolder = async (folderId) => {
    await base44.entities.Folder.delete(folderId);
    setFolders((current) => current.filter((folder) => folder.id !== folderId));
    if (activeFolder === folderId) setActiveFolder("all");
  };

  const removeSaved = async (savedId) => {
    await base44.entities.SavedWallpaper.delete(savedId);
    setSavedWallpapers((current) => current.filter((wallpaper) => wallpaper.id !== savedId));
    toast.success("Wallpaper removido");
  };

  const filteredWallpapers =
    activeFolder === "all"
      ? savedWallpapers
      : savedWallpapers.filter((wallpaper) => wallpaper.folder_id === activeFolder);

  const isPremium = user?.is_premium || usageHook.isPremium();
  const savesCount = usageHook.getSavesCount();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-0">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-10 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Explorar
            </Link>
            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={() => setShowDeleteAccount(true)}
                className="inline-flex items-center gap-2 text-destructive transition hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
                Excluir conta
              </button>
              <button
                onClick={() => base44.auth.logout("/")}
                className="inline-flex items-center gap-2 text-muted-foreground transition hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-[1.6rem] bg-primary/12 text-3xl font-heading font-bold text-primary">
                {user.full_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-heading text-4xl font-bold tracking-[-0.03em] text-white">{user.full_name || user.email}</h1>
                  {isPremium && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2.5 py-1 text-xs text-yellow-400">
                      <Crown className="h-3.5 w-3.5" />
                      Premium
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xl text-muted-foreground">{user.email}</p>
              </div>
            </div>

            {!isPremium && (
              <Link
                to="/premium"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-primary/25 bg-primary/10 px-6 py-3 text-lg text-primary transition hover:bg-primary/15"
              >
                <Crown className="h-4 w-4" />
                Assinar Premium
              </Link>
            )}
          </div>
        </div>

        {!isPremium && (
          <section className="mb-10 flex items-center justify-between rounded-[1.8rem] border border-white/8 bg-card/80 px-6 py-6 shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
            <div>
              <p className="font-heading text-2xl font-bold text-white">Saves hoje</p>
              <p className="mt-2 text-base text-muted-foreground">Reset à meia-noite (Brasília) — {getTodayBrasilia()}</p>
            </div>
            <div className="flex items-center gap-5">
              <div className="flex gap-2">
                {[0, 1, 2].map((index) => (
                  <span
                    key={index}
                    className={cn("h-3.5 w-3.5 rounded-full", index < savesCount ? "bg-primary" : "bg-white/10")}
                  />
                ))}
              </div>
              <span className="font-heading text-3xl font-bold text-white">{savesCount}/3</span>
            </div>
          </section>
        )}

        <section className="grid gap-10 lg:grid-cols-[240px,1fr]">
          <aside>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Pastas</p>
              <button
                onClick={() => setShowNewFolder((current) => !current)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-card hover:text-foreground"
              >
                <FolderPlus className="h-4 w-4" />
              </button>
            </div>

            {showNewFolder && (
              <div className="mb-4 rounded-2xl border border-white/8 bg-card/80 p-4">
                <input
                  autoFocus
                  value={newFolderName}
                  onChange={(event) => setNewFolderName(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && createFolder()}
                  placeholder="Nome da pasta"
                  className="mb-3 w-full rounded-xl border border-white/10 bg-background/80 px-3 py-2 text-sm outline-none"
                />
                <div className="mb-3 flex gap-2">
                  {FOLDER_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewFolderColor(color)}
                      className={cn("h-5 w-5 rounded-full transition-transform", newFolderColor === color && "scale-125 ring-2 ring-white/20")}
                      style={{ background: color }}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={createFolder} className="flex-1 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
                    Criar
                  </button>
                  <button onClick={() => setShowNewFolder(false)} className="rounded-xl bg-secondary px-3 py-2 text-sm text-muted-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <button
                onClick={() => setActiveFolder("all")}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-lg transition",
                  activeFolder === "all" ? "bg-primary/12 text-primary" : "bg-card/60 text-muted-foreground hover:text-foreground"
                )}
              >
                <Bookmark className="h-4 w-4 shrink-0" />
                <span className="flex-1">Todos</span>
                <span className="text-sm opacity-60">{savedWallpapers.length}</span>
              </button>

              {folders.map((folder) => (
                <div key={folder.id} className="group flex items-center gap-2">
                  <button
                    onClick={() => setActiveFolder(folder.id)}
                    className={cn(
                      "flex flex-1 items-center gap-3 rounded-2xl px-4 py-3 text-left text-lg transition",
                      activeFolder === folder.id ? "bg-primary/12 text-primary" : "bg-card/60 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="h-3 w-3 rounded-full" style={{ background: folder.color }} />
                    <span className="flex-1 truncate">{folder.name}</span>
                    <span className="text-sm opacity-60">
                      {savedWallpapers.filter((wallpaper) => wallpaper.folder_id === folder.id).length}
                    </span>
                  </button>
                  <button
                    onClick={() => deleteFolder(folder.id)}
                    className="opacity-0 transition text-muted-foreground hover:text-destructive group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </aside>

          <div>
            {loading ? (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="aspect-[4/5] animate-pulse rounded-[1.8rem] bg-card" />
                ))}
              </div>
            ) : filteredWallpapers.length === 0 ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <Bookmark className="mb-6 h-14 w-14 text-muted-foreground/30" />
                <p className="font-heading text-4xl font-medium tracking-[-0.03em] text-muted-foreground">
                  Nenhum wallpaper salvo aqui
                </p>
                <p className="mt-3 text-2xl text-muted-foreground/70">Explore e salve seus favoritos</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {filteredWallpapers.map((wallpaper) => (
                  <div key={wallpaper.id} className="group relative aspect-[4/5] overflow-hidden rounded-[1.8rem] border border-white/8 bg-card/60">
                    <img
                      src={wallpaper.wallpaper_thumb}
                      alt={wallpaper.wallpaper_title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <p className="font-heading text-lg font-semibold text-white">{wallpaper.wallpaper_title}</p>
                      <p className="mt-1 text-sm text-slate-300">{wallpaper.author || wallpaper.source}</p>
                    </div>
                    <button
                      onClick={() => removeSaved(wallpaper.id)}
                      className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-black/50 text-white opacity-0 transition hover:bg-destructive group-hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {showDeleteAccount && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl" onClick={() => setShowDeleteAccount(false)}>
          <div className="w-full max-w-sm rounded-3xl border border-destructive/30 bg-card p-8" onClick={(event) => event.stopPropagation()}>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
            <h2 className="text-center font-heading text-2xl font-bold text-white">Excluir conta</h2>
            <p className="mb-5 mt-3 text-center text-sm text-muted-foreground">
              Isso apagará todos os seus dados permanentemente. Digite seu email para confirmar:
            </p>
            <input
              value={deleteConfirm}
              onChange={(event) => setDeleteConfirm(event.target.value)}
              placeholder={user.email}
              className="mb-3 w-full rounded-xl border border-white/10 bg-secondary/50 px-3 py-2 text-sm outline-none"
            />
            <button
              onClick={handleDeleteAccount}
              disabled={deleteConfirm !== user.email}
              className="w-full rounded-xl bg-destructive py-3 text-sm font-medium text-white transition disabled:opacity-40"
            >
              Excluir permanentemente
            </button>
            <button onClick={() => setShowDeleteAccount(false)} className="mt-2 w-full py-2.5 text-sm text-muted-foreground transition hover:text-foreground">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
