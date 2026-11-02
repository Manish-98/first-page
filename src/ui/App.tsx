import AppErrorBoundary from "./components/AppErrorBoundary";
import AppShell from "./components/AppShell";

export default function App() {
  return (
    <AppErrorBoundary>
      <AppShell />
    </AppErrorBoundary>
  );
}
