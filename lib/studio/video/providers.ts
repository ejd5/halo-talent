import type { VideoMode } from "../types";

// ─── Types ───

export interface VideoProviderResult {
  id: string;
  eta_ms: number;
}

export interface VideoProviderStatus {
  status: "pending" | "processing" | "succeeded" | "failed";
  video_url?: string;
  progress?: number;
  error?: string;
}

// ─── Configuration ───

const PROVIDER_CONFIGS: Record<string, { apiKeyEnv: string; apiUrl: string }> = {
  "runway-gen4": { apiKeyEnv: "RUNWAY_API_KEY", apiUrl: "https://api.runwayml.com/v1" },
  "kling-2": { apiKeyEnv: "KLING_API_KEY", apiUrl: "https://api.klingai.com/v1" },
  luma: { apiKeyEnv: "LUMA_API_KEY", apiUrl: "https://api.lumalabs.ai/v1" },
  "pika-2": { apiKeyEnv: "PIKA_API_KEY", apiUrl: "https://api.pika.art/v1" },
  "sora-2": { apiKeyEnv: "OPENAI_API_KEY", apiUrl: "https://api.openai.com/v1" },
  "veo-3": { apiKeyEnv: "GOOGLE_API_KEY", apiUrl: "https://api.vertexai.google.com/v1" },
};

function getProviderConfig(modelId: string) {
  return PROVIDER_CONFIGS[modelId];
}

// ─── Simulated Generation ───
// When no API key is configured, simulate the generation with realistic timing
// and return a generated video URL from the pool.

const DEMO_VIDEOS = [
  "/demo/sample-1.mp4",
  "/demo/sample-2.mp4",
  "/demo/sample-3.mp4",
  "/demo/sample-4.mp4",
];

function pickDemoVideo(): string {
  return DEMO_VIDEOS[Math.floor(Math.random() * DEMO_VIDEOS.length)];
}

interface SimulateParams {
  prompt: string;
  duration: number;
  aspect_ratio: string;
  model: string;
  mode: VideoMode;
}

function simulateStart(_params: SimulateParams): VideoProviderResult {
  // Simulate realistic ETA based on model
  const config = PROVIDER_CONFIGS[_params.model];
  // Actual API calls would go to config.apiUrl
  void config; // used when real API calls are implemented

  const baseDelay = _params.duration * 10000; // ~10s per second of video
  const jitter = Math.random() * 20000;
  const eta_ms = Math.max(15000, baseDelay + jitter);

  return {
    id: `sim_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    eta_ms,
  };
}

function simulatePoll(externalJobId: string, startedAt: number, etaMs: number): VideoProviderStatus {
  const elapsed = Date.now() - startedAt;
  const progress = Math.min(0.95, elapsed / etaMs);

  if (elapsed >= etaMs) {
    return {
      status: "succeeded",
      progress: 1,
      video_url: `/api/studio/generate/video/demo?seed=${externalJobId}`,
    };
  }

  return {
    status: "processing",
    progress,
  };
}

// ─── Public API ───

export async function startVideoGeneration(params: {
  model: string;
  prompt: string;
  duration: number;
  aspect_ratio: string;
  mode: VideoMode;
  reference_image?: string | null;
}): Promise<VideoProviderResult> {
  const config = getProviderConfig(params.model);

  // If API key is configured, use the real provider
  if (config && process.env[config.apiKeyEnv]) {
    switch (params.model) {
      case "runway-gen4":
        return startRunwayGeneration(params);
      case "kling-2":
        return startKlingGeneration(params);
      case "luma":
        return startLumaGeneration(params);
      case "pika-2":
        return startPikaGeneration(params);
      case "sora-2":
        return startSoraGeneration(params);
      case "veo-3":
        return startVeoGeneration(params);
      default:
        return simulateStart(params);
    }
  }

  // No API key, simulate
  return simulateStart(params);
}

export async function checkVideoJobStatus(model: string, externalJobId: string, startedAt: number, etaMs: number): Promise<VideoProviderStatus> {
  const config = getProviderConfig(model);

  if (config && process.env[config.apiKeyEnv]) {
    switch (model) {
      case "runway-gen4":
        return checkRunwayStatus(externalJobId);
      case "kling-2":
        return checkKlingStatus(externalJobId);
      case "luma":
        return checkLumaStatus(externalJobId);
      case "pika-2":
        return checkPikaStatus(externalJobId);
      case "sora-2":
        return checkSoraStatus(externalJobId);
      case "veo-3":
        return checkVeoStatus(externalJobId);
      default:
        return simulatePoll(externalJobId, startedAt, etaMs);
    }
  }

  return simulatePoll(externalJobId, startedAt, etaMs);
}

// ─── Provider Implementations ───

async function startRunwayGeneration(params: {
  prompt: string;
  duration: number;
  aspect_ratio: string;
  mode: VideoMode;
  reference_image?: string | null;
}): Promise<VideoProviderResult> {
  const response = await fetch(`${getProviderConfig("runway-gen4")!.apiUrl}/text_to_video`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RUNWAY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      promptText: params.prompt,
      duration: params.duration,
      ratio: params.aspect_ratio,
      model: "gen-4",
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Runway error");
  return { id: data.id, eta_ms: data.estimatedTime || 60000 };
}

async function checkRunwayStatus(externalJobId: string): Promise<VideoProviderStatus> {
  const response = await fetch(`${getProviderConfig("runway-gen4")!.apiUrl}/tasks/${externalJobId}`, {
    headers: { Authorization: `Bearer ${process.env.RUNWAY_API_KEY}` },
  });
  const data = await response.json();
  if (!response.ok) return { status: "failed", error: data.error };

  return {
    status: data.status === "succeeded" ? "succeeded" : data.status === "failed" ? "failed" : "processing",
    progress: data.progress || 0,
    video_url: data.output?.video_url,
  };
}

async function startKlingGeneration(params: {
  prompt: string;
  duration: number;
  aspect_ratio: string;
  mode: VideoMode;
  reference_image?: string | null;
}): Promise<VideoProviderResult> {
  const response = await fetch(`${getProviderConfig("kling-2")!.apiUrl}/videos`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.KLING_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: params.prompt,
      duration: params.duration,
      aspect_ratio: params.aspect_ratio,
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Kling error");
  return { id: data.id, eta_ms: data.estimated_time || 75000 };
}

async function checkKlingStatus(externalJobId: string): Promise<VideoProviderStatus> {
  const response = await fetch(`${getProviderConfig("kling-2")!.apiUrl}/videos/${externalJobId}`, {
    headers: { Authorization: `Bearer ${process.env.KLING_API_KEY}` },
  });
  const data = await response.json();
  if (!response.ok) return { status: "failed", error: data.error };
  return {
    status: data.status === "completed" ? "succeeded" : data.status === "failed" ? "failed" : "processing",
    progress: data.progress || 0,
    video_url: data.output?.video_url,
  };
}

async function startLumaGeneration(params: {
  prompt: string;
  duration: number;
  aspect_ratio: string;
  mode: VideoMode;
  reference_image?: string | null;
}): Promise<VideoProviderResult> {
  const response = await fetch(`${getProviderConfig("luma")!.apiUrl}/generations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.LUMA_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: params.prompt,
      duration_seconds: params.duration,
      aspect_ratio: params.aspect_ratio,
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Luma error");
  return { id: data.id, eta_ms: data.estimated_time || 45000 };
}

async function checkLumaStatus(externalJobId: string): Promise<VideoProviderStatus> {
  const response = await fetch(`${getProviderConfig("luma")!.apiUrl}/generations/${externalJobId}`, {
    headers: { Authorization: `Bearer ${process.env.LUMA_API_KEY}` },
  });
  const data = await response.json();
  if (!response.ok) return { status: "failed", error: data.error };
  return {
    status: data.state === "completed" ? "succeeded" : data.state === "failed" ? "failed" : "processing",
    progress: data.progress || 0,
    video_url: data.assets?.video,
  };
}

async function startPikaGeneration(params: {
  prompt: string;
  duration: number;
  aspect_ratio: string;
  mode: VideoMode;
  reference_image?: string | null;
}): Promise<VideoProviderResult> {
  const response = await fetch(`${getProviderConfig("pika-2")!.apiUrl}/generate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PIKA_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: params.prompt,
      duration: params.duration,
      aspect_ratio: params.aspect_ratio,
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Pika error");
  return { id: data.id, eta_ms: data.eta || 50000 };
}

async function checkPikaStatus(externalJobId: string): Promise<VideoProviderStatus> {
  const response = await fetch(`${getProviderConfig("pika-2")!.apiUrl}/generate/${externalJobId}`, {
    headers: { Authorization: `Bearer ${process.env.PIKA_API_KEY}` },
  });
  const data = await response.json();
  if (!response.ok) return { status: "failed", error: data.error };
  return {
    status: data.status === "completed" ? "succeeded" : data.status === "failed" ? "failed" : "processing",
    progress: data.progress || 0,
    video_url: data.output?.video_url,
  };
}

async function startSoraGeneration(params: {
  prompt: string;
  duration: number;
  aspect_ratio: string;
  mode: VideoMode;
  reference_image?: string | null;
}): Promise<VideoProviderResult> {
  const response = await fetch("https://api.openai.com/v1/video/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "sora-2",
      prompt: params.prompt,
      duration: params.duration,
      aspect_ratio: params.aspect_ratio,
      n: 1,
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Sora error");
  return { id: data.id, eta_ms: data.estimated_time || 120000 };
}

async function checkSoraStatus(externalJobId: string): Promise<VideoProviderStatus> {
  const response = await fetch(`https://api.openai.com/v1/video/generations/${externalJobId}`, {
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
  });
  const data = await response.json();
  if (!response.ok) return { status: "failed", error: data.error?.message };
  return {
    status: data.status === "completed" ? "succeeded" : data.status === "failed" ? "failed" : "processing",
    progress: data.progress || 0,
    video_url: data.output?.video_url,
  };
}

async function startVeoGeneration(params: {
  prompt: string;
  duration: number;
  aspect_ratio: string;
  mode: VideoMode;
  reference_image?: string | null;
}): Promise<VideoProviderResult> {
  const response = await fetch(`${getProviderConfig("veo-3")!.apiUrl}/publishers/google/models/veo-3:predict`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GOOGLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      instances: [{ prompt: params.prompt }],
      parameters: {
        durationSeconds: params.duration,
        aspectRatio: params.aspect_ratio,
      },
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Veo error");
  return { id: data.name, eta_ms: 150000 };
}

async function checkVeoStatus(externalJobId: string): Promise<VideoProviderStatus> {
  const response = await fetch(`${getProviderConfig("veo-3")!.apiUrl}/${externalJobId}`, {
    headers: { Authorization: `Bearer ${process.env.GOOGLE_API_KEY}` },
  });
  const data = await response.json();
  if (!response.ok) return { status: "failed", error: data.error?.message };
  return {
    status: data.state === "succeeded" ? "succeeded" : data.state === "failed" ? "failed" : "processing",
    progress: data.progress || 0,
    video_url: data.output?.video_url,
  };
}
