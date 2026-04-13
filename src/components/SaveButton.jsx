import { useMemo, useState } from "react";
import { Bookmark, Check } from "lucide-react";
import AdModal from "@/components/AdModal";
import Drawer from "@/components/Drawer";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function SaveButton({ wallpaper, usageHook }) {
  const { user, openAuthModal } = useAuth();
  const [showAdModal, setShowAdModal] = useState(false);
  const [showFolderPicker, setShowFolderPicker] = useState(false);

  const folders = useMemo(
    () => (user ? base44.entities.Folder.filter({ user_email: user.email }) : []),
    [user, showFolderPicker]
  );

  const existing = useMemo(() => {
    if (!user) return null;
    return base44.entities.SavedWallpaper.filter({ user_email: user.email }).find((item) => item.wallpaper_id === wallpaper.id);
  }, [user, wallpaper.id, showFolderPicker]);

  const saveInFolder = (folderId = "all") => {
    if (!user) {
      openAuthModal();
      return;
    }
    if (existing) {
      toast.success("Esse wallpaper ja esta salvo");
      return;
    }
    if (usageHook.needsAd()) {
      setShowAdModal(true);
      return;
    }
    if (!usageHook.consumeSave()) {
      toast.error("Seu limite gratuito acabou por hoje");
      return;
    }
    base44.entities.SavedWallpaper.create({
      user_email: user.email,
      folder_id: folderId,
      wallpaper_id: wallpaper.id,
      wallpaper_title: wallpaper.title,
      wallpaper_thumb: wallpaper.thumbnailUrl,
      wallpaper_url: wallpaper.imageUrl,
      author: wallpaper.author,
      source: wallpaper.source,
    });
    setShowFolderPicker(false);
    toast.success("Wallpaper salvo");
  };

  return (
    <>
      <button
        onClick={() => {
          if (!user) {
            openAuthModal();
            return;
          }
          if (existing) {
            toast.success("Esse wallpaper ja esta salvo");
            return;
          }
          setShowFolderPicker(true);
        }}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition",
          existing ? "bg-primary/15 text-primary" : "border border-border/60 bg-card/80 text-foreground hover:bg-card"
        )}
      >
        {existing ? <Check className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
        {existing ? "Salvo" : "Salvar"}
      </button>

      <Drawer open={showFolderPicker} onClose={() => setShowFolderPicker(false)} title="Salvar em pasta">
        <div className="space-y-2">
          <button onClick={() => saveInFolder("all")} className="w-full rounded-2xl bg-primary/15 px-4 py-3 text-left text-sm text-primary">
            Sem pasta
          </button>
          {folders.map((folder) => (
            <button key={folder.id} onClick={() => saveInFolder(folder.id)} className="flex w-full items-center gap-3 rounded-2xl bg-secondary/60 px-4 py-3 text-left text-sm">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: folder.color }} />
              {folder.name}
            </button>
          ))}
        </div>
      </Drawer>

      <AdModal
        open={showAdModal}
        onClose={() => setShowAdModal(false)}
        onReward={() => {
          usageHook.grantAdReward();
          saveInFolder("all");
        }}
      />
    </>
  );
}
