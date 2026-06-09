export function addDisclosureIfRequired(
  text: string,
  platform: string,
  isAIAssisted: boolean,
): string {
  if (!isAIAssisted) return text;

  switch (platform) {
    case "email":
      return (
        text +
        "\n\n---\nMessage personnalisé avec assistance IA, validé par le créateur."
      );
    case "onlyfans":
    case "mym":
    case "fansly":
      return text;
    default:
      return text;
  }
}
