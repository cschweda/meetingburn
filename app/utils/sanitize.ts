/**
 * Sanitize user-provided strings for safe display and export.
 * Removes HTML, control characters, and other potentially dangerous content.
 */
export function sanitizeString(input: unknown, maxLength = 500): string {
  if (typeof input !== 'string') return ''
  return input
    .slice(0, maxLength)
    .replace(/[\x00-\x1f\x7f]/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/<[^>]*>?/g, '')
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .trim()
}
