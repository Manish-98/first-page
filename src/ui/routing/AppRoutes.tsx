import { useSyncExternalStore } from "react";
import type { CVCreationDependencies } from "../../application/cv/createCV";
import NotFoundPage from "../components/NotFoundPage";
import WelcomePanel from "../components/WelcomePanel";
import NewCVPage from "../components/NewCVPage";
import CVDocumentPage from "../components/CVDocumentPage";

const routeTable = {
  "/": WelcomePanel,
} as const;

interface AppRoutesProps {
  cvCreationDependencies: CVCreationDependencies;
}

function getCurrentPath() {
  const hash = window.location.hash;
  const path = hash.startsWith("#") ? hash.slice(1) : "/";
  return path || "/";
}

function subscribeToRouteChanges(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

export default function AppRoutes({ cvCreationDependencies }: AppRoutesProps) {
  const path = useSyncExternalStore(
    subscribeToRouteChanges,
    getCurrentPath,
    () => "/",
  );

  if (path === "/new-cv") {
    return <NewCVPage creationDependencies={cvCreationDependencies} />;
  }

  if (path === "/cv") return <CVDocumentPage editingDependencies={cvCreationDependencies} />;

  const Route = routeTable[path as keyof typeof routeTable];
  return Route ? <Route /> : <NotFoundPage />;
}