import { readJson, writeJson } from "@/services/storage/storage";
import { getTodayInBrasilia } from "@/utils/brasilia";

const KEY = "zenwall_usage_v2";

function readUsage() {
  return readJson(KEY, {});
}

function writeUsage(value) {
  writeJson(KEY, value);
}

export function getUsageState(user) {
  const date = getTodayInBrasilia();
  if (!user) {
    return { savesCount: 0, adCredits: 0, date };
  }

  const allUsage = readUsage();
  const current = allUsage[user.email];
  if (!current || current.date !== date) {
    const next = { savesCount: 0, adCredits: 0, date };
    allUsage[user.email] = next;
    writeUsage(allUsage);
    return next;
  }

  return current;
}

function setUsageState(user, state) {
  if (!user) return;
  const allUsage = readUsage();
  allUsage[user.email] = state;
  writeUsage(allUsage);
}

export function registerUsageSave(user) {
  if (!user) return { ok: false, reason: "AUTH" };
  if (user.isPremium) return { ok: true, reason: "PREMIUM" };

  const nextState = { ...getUsageState(user) };
  if (nextState.savesCount >= 3 && nextState.adCredits <= 0) {
    return { ok: false, reason: "AD_REQUIRED" };
  }

  if (nextState.savesCount >= 3 && nextState.adCredits > 0) {
    nextState.adCredits -= 1;
  }

  nextState.savesCount += 1;
  setUsageState(user, nextState);
  return { ok: true, reason: "OK" };
}

export function grantUsageAdCredit(user) {
  if (!user || user.isPremium) return;
  const nextState = { ...getUsageState(user) };
  nextState.adCredits += 1;
  setUsageState(user, nextState);
}

export function clearUsageState(email) {
  const allUsage = readUsage();
  delete allUsage[email];
  writeUsage(allUsage);
}
