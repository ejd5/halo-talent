// ─── WTF Lex, Streaming Helpers ─────────────────────────────
// Utilitaires pour le streaming SSE (Server-Sent Events).

/**
 * Crée une réponse SSE avec les headers appropriés.
 */
export function sseResponse(stream: ReadableStream<Uint8Array>): Response {
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

/**
 * Encode un événement SSE.
 */
export function sseEvent(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

/**
 * Encode un message SSE (sans event name).
 */
export function sseData(data: unknown): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

/**
 * Parse un flux SSE en événements.
 * Utile côté client pour consommer le stream.
 */
export function parseSSE(
  text: string
): { event?: string; data: unknown }[] {
  const events: { event?: string; data: unknown }[] = [];
  let currentEvent: string | undefined;
  let currentData = "";

  for (const line of text.split("\n")) {
    if (line.startsWith("event: ")) {
      currentEvent = line.slice(7).trim();
    } else if (line.startsWith("data: ")) {
      currentData += line.slice(6);
    } else if (line === "" && currentData) {
      try {
        events.push({
          event: currentEvent,
          data: JSON.parse(currentData),
        });
      } catch {
        events.push({
          event: currentEvent,
          data: currentData,
        });
      }
      currentEvent = undefined;
      currentData = "";
    }
  }

  return events;
}
