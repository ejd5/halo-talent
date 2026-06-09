export type ProviderId = "replicate" | "huggingface" | "openai" | "anthropic";

interface ProviderInfo {
  id: ProviderId;
  name: string;
  envKey: string;
  configured: boolean;
  isDefault: boolean;
}

function checkEnv(key: string): boolean {
  if (typeof process === "undefined") return false;
  const value = process.env[key];
  return !!value && value.length > 0;
}

export function getAvailableProviders(): ProviderInfo[] {
  return [
    { id: "replicate", name: "Replicate (Flux Schnell)", envKey: "REPLICATE_API_TOKEN", configured: checkEnv("REPLICATE_API_TOKEN"), isDefault: true },
    { id: "huggingface", name: "HuggingFace (FLUX.1-dev)", envKey: "HUGGINGFACE_API_KEY", configured: checkEnv("HUGGINGFACE_API_KEY"), isDefault: false },
    { id: "openai", name: "OpenAI (DALL-E 3)", envKey: "OPENAI_API_KEY", configured: checkEnv("OPENAI_API_KEY"), isDefault: false },
    { id: "anthropic", name: "Anthropic (Claude)", envKey: "ANTHROPIC_API_KEY", configured: checkEnv("ANTHROPIC_API_KEY"), isDefault: false },
  ];
}

export function getPrimaryImageProvider(): ProviderId | null {
  const providers = getAvailableProviders();
  // Try default first (Replicate), then fallback
  const replicate = providers.find((p) => p.id === "replicate");
  if (replicate?.configured) return "replicate";

  const hf = providers.find((p) => p.id === "huggingface");
  if (hf?.configured) return "huggingface";

  const openai = providers.find((p) => p.id === "openai");
  if (openai?.configured) return "openai";

  return null;
}

export function isDemoMode(): boolean {
  return getPrimaryImageProvider() === null;
}

export function getDemoModeMessage(): string {
  return "Le service de génération d'images est en cours de configuration. Réessayez dans quelques minutes.";
}
