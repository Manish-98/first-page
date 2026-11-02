import { useSyncExternalStore } from "react";
import NotFoundPage from "../components/NotFoundPage";
import WelcomePanel from "../components/WelcomePanel";

const routeTable = {
  "/": WelcomePanel,
} as const;

function getCurrentPath() {
  const hash = window.location.hash;
  const path = hash.startsWith("#") ? hash.slice(1) : "/";
  return path || "/";
}

function subscribeToRouteChanges(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

export default function AppRoutes() {
  const path = useSyncExternalStore(
    subscribeToRouteChanges,
    getCurrentPath,
    () => "/",
  );
  const Route = routeTable[path as keyof typeof routeTable];

  return Route ? <Route /> : <NotFoundPage />;
}
