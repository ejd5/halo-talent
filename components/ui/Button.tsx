"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  as?: "button" | "link";
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
};

const variantBase: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: "#C75B39",
    color: "#FFFFFF",
    border: "none",
  },
  secondary: {
    backgroundColor: "transparent",
    border: "1.5px solid var(--color-ink)",
    color: "var(--color-ink)",
  },
  ghost: {
    backgroundColor: "transparent",
    border: "none",
    color: "var(--color-ink-secondary)",
  },
  danger: {
    backgroundColor: "transparent",
    border: "1.5px solid #C44536",
    color: "#C44536",
  },
};

const variantHover: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: "#D4693F",
  },
  secondary: {
    backgroundColor: "rgba(128, 128, 128, 0.08)",
  },
  ghost: {
    color: "var(--color-ink)",
  },
  danger: {
    backgroundColor: "rgba(196, 69, 54, 0.06)",
  },
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
  const [hovered, setHovered] = useState(false);

  const baseClasses = cn(
    "inline-flex items-center justify-center",
    "font-display text-[0.8rem] uppercase tracking-[0.06em]",
    "px-8 py-3",
    "transition-all duration-300",
    "disabled:opacity-40 disabled:pointer-events-none",
    className,
  );

  const style: React.CSSProperties = {
    ...variantBase[variant],
    ...(hovered ? variantHover[variant] : {}),
    transform: hovered && variant === "primary" ? "translateY(-1px)" : "none",
  };

  const handlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  if (as === "link" && href) {
    return (
      <Link href={href} className={baseClasses} style={style} {...handlers}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      style={style}
      {...handlers}
    >
      {children}
    </button>
  );
}
