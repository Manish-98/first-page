import type { CVCreationDependencies } from "../../application/cv/createCV";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import AppRoutes from "../routing/AppRoutes";

interface AppShellProps {
  cvCreationDependencies: CVCreationDependencies;
}

export default function AppShell({ cvCreationDependencies }: AppShellProps) {
  return (
    <div className="app-shell">
      <AppHeader />
      <main className="app-main" id="main-content" tabIndex={-1}>
        <AppRoutes cvCreationDependencies={cvCreationDependencies} />
      </main>
      <AppFooter />
    </div>
  );
}
