import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import WelcomePanel from "./WelcomePanel";

export default function AppShell() {
  return (
    <div className="app-shell">
      <AppHeader />
      <main className="app-main" id="main-content">
        <WelcomePanel />
      </main>
      <AppFooter />
    </div>
  );
}
