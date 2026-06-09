import { StudioLayoutClient } from "./StudioLayoutClient";

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudioLayoutClient userName="Créateur">
      {children}
    </StudioLayoutClient>
  );
}
