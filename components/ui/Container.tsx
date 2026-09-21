import type { HTMLAttributes } from "react";

type ContainerProps = HTMLAttributes<HTMLDivElement>;

export default function Container({
  className = "",
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={`rr-container ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}