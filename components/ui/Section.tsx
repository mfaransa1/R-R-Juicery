import type { HTMLAttributes } from "react";

type SectionProps = HTMLAttributes<HTMLElement> & {
  tight?: boolean;
};

export default function Section({
  children,
  className = "",
  tight = false,
  ...props
}: SectionProps) {
  return (
    <section
      className={`${tight ? "rr-section-tight" : "rr-section"} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}