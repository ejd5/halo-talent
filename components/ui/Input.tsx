"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs uppercase tracking-[0.15em] text-ink-muted mb-3"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full bg-transparent border-b border-ink/20 py-3 text-ink",
            "placeholder:text-ink-muted/50 text-lg",
            "focus:outline-none focus:border-accent transition-colors",
            "autofill:bg-transparent",
            error && "border-alert",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-alert">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
