import type { ReactNode, AnchorHTMLAttributes } from "react";

type AppLinkVariant = "wordmark" | "navigation" | "action";

type AppLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> & {
  children: ReactNode;
  variant?: AppLinkVariant;
};

export default function AppLink({
  children,
  variant = "navigation",
  ...anchorProps
}: AppLinkProps) {
  return (
    <a className={`app-link app-link--${variant}`} {...anchorProps}>
      {children}
    </a>
  );
}
