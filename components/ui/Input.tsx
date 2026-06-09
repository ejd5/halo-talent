"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  theme?: "light" | "dark";
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, theme = "light", ...props }, ref) => {
    const inputStyle: React.CSSProperties =
      theme === "dark"
        ? {
            backgroundColor: "#2A2420",
            border: "1px solid rgba(245, 240, 235, 0.08)",
            color: "#F5F0EB",
          }
        : {
            backgroundColor: "#FFFFFF",
            border: "1px solid rgba(26, 22, 20, 0.1)",
            color: "#1A1614",
          };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block font-sans text-[0.7rem] uppercase tracking-[0.08em] mb-2"
            style={{ color: "var(--color-ink-tertiary)" }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full px-3 py-3 text-sm outline-none transition-all duration-200",
            "placeholder:font-sans placeholder:text-sm",
            "focus:border-[#C75B39]",
            error && "!border-[#C44536]",
            className,
          )}
          style={{
            ...inputStyle,
            boxShadow: error
              ? "none"
              : undefined,
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(199, 91, 57, 0.08)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = "none";
          }}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs" style={{ color: "#C44536" }}>
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
