import { cn } from "@/lib/utils";

type SectionDividerProps = {
  variant?: "accent" | "subtle" | "none";
  className?: string;
};

export function SectionDivider({ variant = "accent", className }: SectionDividerProps) {
  if (variant === "none") return null;

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "h-px w-full",
          variant === "accent" && "bg-accent/40",
          variant === "subtle" && "bg-ink/5"
        )}
      />
    </div>
  );
}
