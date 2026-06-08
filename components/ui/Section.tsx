import { cn } from "@/lib/utils";
import { Container } from "./Container";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  as?: "section" | "div" | "article" | "header" | "footer";
  background?: "light" | "dark" | "cream";
};

const backgroundStyles = {
  light: "bg-base",
  dark: "bg-dark text-dark-text",
  cream: "bg-base-alt",
};

export function Section({
  children,
  className,
  containerClassName,
  as: Tag = "section",
  background = "light",
}: SectionProps) {
  return (
    <Tag
      className={cn(
        "py-30 md:py-40",
        backgroundStyles[background],
        className
      )}
    >
      <Container className={containerClassName}>{children}</Container>
    </Tag>
  );
}
