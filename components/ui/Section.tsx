import { cn } from "@/lib/utils";
import { Container } from "./Container";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  as?: "section" | "div" | "article" | "header" | "footer";
  background?: "black" | "espresso" | "ivory";
};

const backgroundStyles = {
  black: "bg-brand-black",
  espresso: "bg-brand-espresso",
  ivory: "bg-brand-ivory text-brand-black",
};

export function Section({
  children,
  className,
  containerClassName,
  as: Tag = "section",
  background = "black",
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
