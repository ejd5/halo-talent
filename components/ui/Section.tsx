import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  as?: "section" | "div" | "article" | "header" | "footer";
  background?: "light" | "dark" | "cream";
  id?: string;
};

const backgroundStyles = {
  light: "bg-base",
  dark: "bg-dark text-dark-text",
  cream: "bg-base-alt",
};

export const Section = forwardRef<HTMLElement, SectionProps>(function Section({
  children,
  className,
  containerClassName,
  as: Tag = "section",
  background = "light",
  id,
}, ref) {
  const As = Tag as any;
  return (
    <As
      ref={ref}
      id={id}
      className={cn(
        "py-30 md:py-40",
        backgroundStyles[background],
        className
      )}
    >
      <Container className={containerClassName}>{children}</Container>
    </As>
  );
});
