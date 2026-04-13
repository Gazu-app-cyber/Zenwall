import { createId, readJson, writeJson } from "@/services/storage/storage";

const KEY = "zenwall_saved_wallpapers_v2";

function readSaved() {
  return readJson(KEY, []);
}

function writeSaved(items) {
  writeJson(KEY, items);
}

export function getSavedWallpapersByUser(email) {
  return readSaved().filter((item) => item.userEmail === email);
}

export function saveWallpaperRecord(payload) {
  const items = readSaved();
  const duplicate = items.find(
    (item) => item.userEmail === payload.userEmail && item.wallpaperId === payload.wallpaperId
  );

  if (duplicate) {
    return duplicate;
  }

  const nextItem = {
    id: createId("saved"),
    userEmail: payload.userEmail,
    wallpaperId: payload.wallpaperId,
    wallpaperTitle: payload.wallpaperTitle,
    wallpaperThumb: payload.wallpaperThumb,
    wallpaperUrl: payload.wallpaperUrl,
    wallpaperAuthor: payload.wallpaperAuthor,
    folderId: payload.folderId || "all",
    createdAt: new Date().toISOString(),
  };

  writeSaved([nextItem, ...items]);
  return nextItem;
}

export function removeSavedWallpaperRecord(savedId) {
  writeSaved(readSaved().filter((item) => item.id !== savedId));
}

export function removeSavedByUser(email) {
  writeSaved(readSaved().filter((item) => item.userEmail !== email));
}
