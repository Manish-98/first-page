import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import AppRoutes from "../routing/AppRoutes";

export default function AppShell() {
  return (
    <div className="app-shell">
      <AppHeader />
      <main className="app-main" id="main-content" tabIndex={-1}>
        <AppRoutes />
      </main>
      <AppFooter />
    </div>
  );
}
