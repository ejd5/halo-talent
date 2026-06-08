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
            className="block text-xs uppercase tracking-[0.15em] text-brand-taupe mb-3"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full bg-transparent border-b border-white/20 py-3 text-brand-ivory",
            "placeholder:text-brand-taupe/50 text-lg",
            "focus:outline-none focus:border-brand-gold transition-colors",
            "autofill:bg-transparent",
            error && "border-brand-alert",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-brand-alert">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
