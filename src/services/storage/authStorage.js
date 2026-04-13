import { createId, readJson, writeJson } from "@/services/storage/storage";
import { removeFoldersByUser } from "@/services/storage/folderStorage";
import { removeSavedByUser } from "@/services/storage/savedWallpapersStorage";
import { clearUsageState } from "@/services/storage/usageStorage";

const KEYS = {
  users: "zenwall_users_v2",
  currentUser: "zenwall_current_user_v2",
};

function getUsers() {
  return readJson(KEYS.users, []);
}

function setUsers(users) {
  writeJson(KEYS.users, users);
}

export function findCurrentUser() {
  return readJson(KEYS.currentUser, null);
}

function setCurrentUser(user) {
  writeJson(KEYS.currentUser, user);
}

export function createUserAccount({ email, password, fullName }) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getUsers();

  if (users.some((item) => item.email === normalizedEmail)) {
    throw new Error("Este email ja esta cadastrado.");
  }

  const user = {
    id: createId("user"),
    email: normalizedEmail,
    password,
    fullName: fullName.trim(),
    isPremium: false,
    createdAt: new Date().toISOString(),
  };

  setUsers([user, ...users]);
  setCurrentUser(user);
  return user;
}

export function loginUserAccount({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = getUsers().find((item) => item.email === normalizedEmail && item.password === password);

  if (!user) {
    throw new Error("Email ou senha invalidos.");
  }

  setCurrentUser(user);
  return user;
}

export function logoutUserAccount() {
  setCurrentUser(null);
}

export function activatePremium(userId) {
  const users = getUsers();
  const updated = users.map((item) => (item.id === userId ? { ...item, isPremium: true } : item));
  setUsers(updated);
  const current = updated.find((item) => item.id === userId) || null;
  setCurrentUser(current);
  return current;
}

export function deleteUserAccount(userId, email) {
  setUsers(getUsers().filter((item) => item.id !== userId));
  removeFoldersByUser(email);
  removeSavedByUser(email);
  clearUsageState(email);
  setCurrentUser(null);
}
