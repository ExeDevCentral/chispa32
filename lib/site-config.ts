/** Número WhatsApp del taller — formato internacional sin + (ej: 5493412345678) */
export const WORKSHOP_WHATSAPP =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5493410000000";

/** URL del sitio — configurar cuando tengas dominio */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Email de contacto del taller */
export const WORKSHOP_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "taller@chispa32.com";

export function whatsappUrl(message: string): string {
  return `https://wa.me/${WORKSHOP_WHATSAPP}?text=${encodeURIComponent(message)}`;
}
