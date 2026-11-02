import type { ReactNode } from "react";

type ContentSectionProps = {
  children: ReactNode;
  labelledBy: string;
  className?: string;
};

export default function ContentSection({
  children,
  labelledBy,
  className,
}: ContentSectionProps) {
  const classes = ["content-section", className].filter(Boolean).join(" ");

  return (
    <section className={classes} aria-labelledby={labelledBy}>
      {children}
    </section>
  );
}
