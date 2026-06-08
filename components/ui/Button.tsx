import { cn } from "@/lib/utils";
import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "dark" | "ghost";
  className?: string;
  as?: "button" | "link";
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
};

const variants = {
  primary:
    "bg-accent text-white hover:bg-accent-hover",
  secondary:
    "border border-ink text-ink hover:bg-ink hover:text-base",
  dark:
    "border border-dark-text text-dark-text hover:bg-dark-text hover:text-dark",
  ghost:
    "text-ink-muted hover:text-ink",
};

export function Button({
  children,
  variant = "primary",
  className,
  as = "button",
  href,
  type = "button",
  onClick,
  disabled,
}: ButtonProps) {
  const base = cn(
    "inline-flex items-center justify-center px-8 py-3 text-[13px] font-sans font-semibold uppercase tracking-[0.08em]",
    variants[variant],
    "disabled:opacity-40 disabled:pointer-events-none",
    className
  );

  if (as === "link" && href) {
    return (
      <Link href={href} className={base}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={base}
    >
      {children}
    </button>
  );
}
