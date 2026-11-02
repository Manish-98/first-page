import type { ReactNode } from "react";

export type FeedbackVariant = "loading" | "empty" | "success" | "error";

type AppFeedbackProps = {
  children: ReactNode;
  title?: string;
  variant: FeedbackVariant;
};

const variantLabels: Record<FeedbackVariant, string> = {
  loading: "Loading",
  empty: "No content",
  success: "Success",
  error: "Something went wrong",
};

export default function AppFeedback({
  children,
  title,
  variant,
}: AppFeedbackProps) {
  const isError = variant === "error";

  return (
    <section
      className={`app-feedback app-feedback--${variant}`}
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      aria-atomic="true"
    >
      <p className="app-feedback__label">{variantLabels[variant]}</p>
      {title ? <h2 className="app-feedback__title">{title}</h2> : null}
      <div className="app-feedback__message">{children}</div>
    </section>
  );
}
