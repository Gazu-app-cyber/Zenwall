import { createId, readJson, writeJson } from "@/services/storage/storage";

const KEY = "zenwall_folders_v2";

function readFolders() {
  return readJson(KEY, []);
}

function writeFolders(items) {
  writeJson(KEY, items);
}

export function getFoldersByUser(email) {
  return readFolders().filter((item) => item.userEmail === email);
}

export function createFolderRecord({ userEmail, name, color }) {
  const folder = {
    id: createId("folder"),
    userEmail,
    name: name.trim(),
    color,
    createdAt: new Date().toISOString(),
  };

  writeFolders([folder, ...readFolders()]);
  return folder;
}

export function deleteFolderRecord(folderId) {
  writeFolders(readFolders().filter((item) => item.id !== folderId));
}

export function removeFoldersByUser(email) {
  writeFolders(readFolders().filter((item) => item.userEmail !== email));
}
