import { cn } from "@/lib/utils";
import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "outline" | "filled" | "ghost";
  className?: string;
  as?: "button" | "link";
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
};

const variants = {
  outline:
    "border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black",
  filled:
    "bg-brand-gold text-brand-black hover:bg-brand-gold-light",
  ghost:
    "text-brand-taupe hover:text-brand-ivory",
};

export function Button({
  children,
  variant = "outline",
  className,
  as = "button",
  href,
  type = "button",
  onClick,
  disabled,
}: ButtonProps) {
  const base = cn(
    "inline-flex items-center justify-center px-8 py-3 text-sm uppercase tracking-[0.15em] transition-all",
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
