import type { AnchorHTMLAttributes, ReactNode } from "react";

type AppLinkVariant = "wordmark" | "navigation" | "action";

type AppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: AppLinkVariant;
};

export default function AppLink({
  children,
  className,
  variant = "navigation",
  ...anchorProps
}: AppLinkProps) {
  const classes = ["app-link", `app-link--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <a className={classes} {...anchorProps}>
      {children}
    </a>
  );
}
