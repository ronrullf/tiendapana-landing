/**
 * Normalizes a Venezuelan phone number to the wa.me format (58XXXXXXXXXX)
 * Accepts: 0414XXXXXXX, 04XX-XXXXXXX, +584XXXXXXXXX, 4XXXXXXXXX, etc.
 */
export function normalizeVzlaPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')

  // Already full with country code: 584XXXXXXXXX (12 digits)
  if (digits.startsWith('58') && digits.length === 12) return digits

  // 04XXXXXXXXX (11 digits) → 584XXXXXXXXX
  if (digits.startsWith('04') && digits.length === 11) return '58' + digits.slice(1)

  // 4XXXXXXXXX (10 digits) → 584XXXXXXXXX
  if (digits.startsWith('4') && digits.length === 10) return '58' + digits

  return digits
}

export function isValidVzlaPhone(raw: string): boolean {
  const normalized = normalizeVzlaPhone(raw)
  return /^584(12|14|16|24|26)\d{7}$/.test(normalized)
}
