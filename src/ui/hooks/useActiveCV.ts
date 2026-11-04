import { useSyncExternalStore } from "react";
import { getActiveCV, subscribeToActiveCV } from "../../application/cv/cvSession";

export function useActiveCV() {
  return useSyncExternalStore(subscribeToActiveCV, getActiveCV, () => null);
}
