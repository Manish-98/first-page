import type { CVCreationDependencies } from "../application/cv/createCV";
import AppErrorBoundary from "./components/AppErrorBoundary";
import AppShell from "./components/AppShell";

interface AppProps {
  cvCreationDependencies: CVCreationDependencies;
}

export default function App({ cvCreationDependencies }: AppProps) {
  return (
    <AppErrorBoundary>
      <AppShell cvCreationDependencies={cvCreationDependencies} />
    </AppErrorBoundary>
  );
}