// Quick client-side checks for instant feedback. The backend re-validates
// everything authoritatively (full disposable-domain list + normalization),
// so this only needs to catch the common/obvious cases.

export function isValidPakistaniPhone(raw: string): boolean {
  return normalizePakistaniPhone(raw) !== null;
}

/** Normalizes to "03XXXXXXXXX" (11 digits), accepting +92/0092/92/0 prefixes. */
export function normalizePakistaniPhone(raw: string): string | null {
  if (!raw) return null;
  let digits = raw.replace(/\D/g, '');
  digits = digits.replace(/^(0092|92)/, '0');
  return /^03\d{9}$/.test(digits) ? digits : null;
}

// Common disposable/temp-mail providers. Not exhaustive, the backend list
// is the real gatekeeper. This just avoids an extra round trip for the
// obvious ones (Mailinator, YOPmail, 10 Minute Mail, etc.).
const COMMON_DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.info', 'guerrillamail.biz',
  'guerrillamail.org', 'guerrillamail.de', 'sharklasers.com', 'yopmail.com',
  'yopmail.fr', 'yopmail.net', '10minutemail.com', '10minutemail.net',
  'temp-mail.org', 'temp-mail.com', 'tempmail.com', 'tempmail.co', 'tempmail.eu',
  'throwawaymail.com', 'trashmail.com', 'trashmail.net', 'dispostable.com',
  'fakeinbox.com', 'getnada.com', 'maildrop.cc', 'mintemail.com', 'mohmal.com',
  'emailondeck.com', 'mailnesia.com', 'moakt.com', 'discard.email',
  'spambog.com', 'spamgourmet.com', 'mailcatch.com', 'inboxbear.com',
  'burnermail.io', 'tempinbox.com', 'dropmail.me', 'mailpoof.com',
  'crazymailing.com', 'mytemp.email', 'anonaddy.com', 'emailfake.com',
]);

export function isLikelyDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase().trim();
  return !!domain && COMMON_DISPOSABLE_DOMAINS.has(domain);
}
