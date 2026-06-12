"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "couture" | "couture-ghost";

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
    backgroundColor: "var(--or, #D8A95B)",
    color: "var(--encre, #0C0A08)",
    border: "1px solid var(--or, #D8A95B)",
  },
  secondary: {
    backgroundColor: "transparent",
    border: "1px solid var(--ligne, rgba(216,169,91,0.18))",
    color: "var(--ivoire, #F4EEE3)",
  },
  ghost: {
    backgroundColor: "transparent",
    border: "none",
    color: "var(--pierre, #9C9183)",
  },
  danger: {
    backgroundColor: "transparent",
    border: "1px solid #E8634A",
    color: "#E8634A",
  },
  couture: {
    backgroundColor: "var(--or, #D8A95B)",
    color: "var(--encre, #0C0A08)",
    border: "1px solid var(--or, #D8A95B)",
  },
  "couture-ghost": {
    backgroundColor: "transparent",
    border: "1px solid rgba(244,238,227,0.18)",
    color: "rgba(244,238,227,0.65)",
  },
};

const variantHover: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: "var(--or-clair, #EBC98A)",
    borderColor: "var(--or-clair, #EBC98A)",
  },
  secondary: {
    borderColor: "var(--or, #D8A95B)",
    color: "var(--or, #D8A95B)",
  },
  ghost: {
    color: "var(--ivoire, #F4EEE3)",
  },
  danger: {
    backgroundColor: "rgba(232, 99, 74, 0.1)",
  },
  couture: {
    backgroundColor: "transparent",
    color: "var(--or, #D8A95B)",
    borderColor: "var(--or, #D8A95B)",
  },
  "couture-ghost": {
    borderColor: "var(--or, #D8A95B)",
    color: "var(--or, #D8A95B)",
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
    "font-util text-[11px] uppercase tracking-[0.22em]",
    "px-[26px] py-[14px]",
    "rounded-[2px]",
    "transition-all duration-300",
    "disabled:opacity-40 disabled:pointer-events-none",
    className,
  );

  const style: React.CSSProperties = {
    ...variantBase[variant],
    ...(hovered ? variantHover[variant] : {}),
    transform: hovered ? "translateY(-1px)" : "none",
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
