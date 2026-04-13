import { useMemo, useState } from "react";
import {
  getUsageState,
  grantUsageAdCredit,
  registerUsageSave,
} from "@/services/storage/usageStorage";

export function useUserUsage(user) {
  const [tick, setTick] = useState(0);

  const usage = useMemo(() => {
    void tick;
    return getUsageState(user);
  }, [tick, user]);

  const refresh = () => setTick((value) => value + 1);
  const isPremium = () => Boolean(user?.isPremium);
  const getSavesCount = () => usage.savesCount;
  const canSave = () => isPremium() || usage.savesCount < 3 || usage.adCredits > 0;
  const needsAd = () => !isPremium() && usage.savesCount >= 3 && usage.adCredits <= 0;

  const consumeSave = () => {
    const result = registerUsageSave(user);
    refresh();
    return result;
  };

  const grantAdReward = () => {
    grantUsageAdCredit(user);
    refresh();
  };

  return {
    usage,
    refresh,
    isPremium,
    getSavesCount,
    canSave,
    needsAd,
    consumeSave,
    grantAdReward,
  };
}
