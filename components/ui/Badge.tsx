import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "alert";

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  default: {
    backgroundColor: "rgba(199, 91, 57, 0.08)",
    color: "#C75B39",
  },
  success: {
    backgroundColor: "rgba(122, 154, 101, 0.08)",
    color: "#7A9A65",
  },
  alert: {
    backgroundColor: "rgba(196, 69, 54, 0.08)",
    color: "#C44536",
  },
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-sans text-[0.65rem] font-medium px-2 py-0.5",
        className,
      )}
      style={variantStyles[variant]}
    >
      {children}
    </span>
  );
}
