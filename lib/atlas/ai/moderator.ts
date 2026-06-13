interface ModerationResult {
  approved: boolean;
  reason?: string;
  confidence: number;
}

const BLOCKED_PATTERNS = [
  /\b(spam|scam|click\s*here)\b/i,
  /https?:\/\/(?:bit\.ly|tinyurl|shorturl|t\.co)\/\S+/i,
  /\b(buy\s*now|limited\s*offer|act\s*now)\b.{0,20}(?:discount|price|offer)/i,
];

const FLAGGED_CONTENT = [
  /\b(promis|guarantee|guaranti|100%\s*.*\b(works|result|effective))\b/i,
  /\b(no\s*risk|risk\s*free|money\s*back\s*guarantee)\b/i,
];

export function moderateComment(
  text: string,
  creatorLanguage: string = "en"
): ModerationResult {
  if (!text || text.trim().length === 0) {
    return { approved: false, reason: "empty_content", confidence: 100 };
  }

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(text)) {
      return { approved: false, reason: "blocked_pattern", confidence: 95 };
    }
  }

  for (const pattern of FLAGGED_CONTENT) {
    if (pattern.test(text)) {
      return { approved: false, reason: "flagged_content", confidence: 70 };
    }
  }

  // Too many emojis or caps = likely spam
  const emojiRatio = (text.match(/[\u{1F600}-\u{1F9FF}]/gu)?.length ?? 0) / text.length;
  if (emojiRatio > 0.5) {
    return { approved: false, reason: "excessive_emoji", confidence: 60 };
  }

  const capsRatio = (text.match(/[A-Z]/g)?.length ?? 0) / text.replace(/\s/g, "").length;
  if (capsRatio > 0.7) {
    return { approved: false, reason: "excessive_caps", confidence: 50 };
  }

  return { approved: true, confidence: 90 };
}

export function moderateDm(text: string): ModerationResult {
  // For DMs, we're less strict, only block obvious spam/scams
  if (!text || text.trim().length === 0) {
    return { approved: false, reason: "empty_content", confidence: 100 };
  }

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(text)) {
      return { approved: false, reason: "blocked_pattern", confidence: 95 };
    }
  }

  return { approved: true, confidence: 95 };
}
