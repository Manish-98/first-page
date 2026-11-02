import { Component, type ErrorInfo, type ReactNode } from "react";
import AppFeedback from "./AppFeedback";

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

export default class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo): void {
    // The fallback is the local, privacy-preserving error report.
    // Do not forward rendering errors or component details to a remote service.
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-error-boundary">
          <AppFeedback
            variant="error"
            title="The workspace couldn’t be displayed."
          >
            <p>
              An unexpected problem interrupted this screen. Your information
              has not been sent anywhere. You can try rendering the workspace
              again.
            </p>
            <button
              className="app-feedback__retry"
              type="button"
              onClick={this.handleRetry}
            >
              Try again
            </button>
          </AppFeedback>
        </div>
      );
    }

    return this.props.children;
  }
}
