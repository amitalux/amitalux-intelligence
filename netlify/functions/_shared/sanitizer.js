export function sanitizeEmailPayload(text) {
  if (!text) return "";

  let cleaned = String(text);
  cleaned = cleaned.replace(/\b(?:\d[ -]*?){13,16}\b/g, "[REDACTED_PAYMENT_CARD]");
  cleaned = cleaned.replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[REDACTED_SSN]");
  cleaned = cleaned.replace(/(password|passwd|secret|pwd)\s*[:=]\s*[^\s,;]+/gi, "$1: [REDACTED_CREDENTIAL]");

  return cleaned;
}
