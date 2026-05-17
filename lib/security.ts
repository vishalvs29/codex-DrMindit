export function sanitizeText(value: string, maxLength = 5000) {
  return value
    .replace(/\u0000/g, "")
    .replace(/\s+\n/g, "\n")
    .trim()
    .slice(0, maxLength);
}

export function estimateTokenCount(value: string) {
  return Math.ceil(value.length / 4);
}
