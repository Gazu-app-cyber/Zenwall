import { useMemo, useState } from "react";
import { getTodayBrasilia } from "@/lib/brasilia";

const STORAGE_KEY = "zenwall_usage";

function readUsage() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeUsage(value) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  }
}

function getFreshState(user) {
  const date = getTodayBrasilia();
  if (!user) return { savesCount: 0, adCredits: 0, date };
  const usage = readUsage();
  const current = usage[user.email];
  if (!current || current.date !== date) {
    const next = { savesCount: 0, adCredits: 0, date };
    usage[user.email] = next;
    writeUsage(usage);
    return next;
  }
  return current;
}

function setFreshState(user, state) {
  if (!user) return state;
  const usage = readUsage();
  usage[user.email] = state;
  writeUsage(usage);
  return state;
}

export function useUserUsage(user) {
  const [tick, setTick] = useState(0);
  const state = useMemo(() => {
    void tick;
    return getFreshState(user);
  }, [tick, user]);

  const refresh = () => setTick((value) => value + 1);
  const isPremium = () => Boolean(user?.is_premium);
  const getSavesCount = () => state.savesCount || 0;
  const canSave = () => isPremium() || state.savesCount < 3 || state.adCredits > 0;
  const needsAd = () => !isPremium() && state.savesCount >= 3 && state.adCredits <= 0;

  const consumeSave = () => {
    if (isPremium()) return true;
    const nextState = { ...getFreshState(user) };
    if (nextState.savesCount >= 3 && nextState.adCredits > 0) {
      nextState.adCredits -= 1;
    } else if (nextState.savesCount >= 3) {
      return false;
    }
    nextState.savesCount += 1;
    setFreshState(user, nextState);
    refresh();
    return true;
  };

  const grantAdReward = () => {
    const nextState = { ...getFreshState(user) };
    nextState.adCredits += 1;
    setFreshState(user, nextState);
    refresh();
  };

  return { isPremium, getSavesCount, canSave, needsAd, consumeSave, grantAdReward, refresh };
}
