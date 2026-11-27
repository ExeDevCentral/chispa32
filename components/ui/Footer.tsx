import Link from "next/link";
import { Cpu, MapPin, Mail, MessageSquare, Lock, Wrench } from "lucide-react";
import { whatsappUrl, WORKSHOP_EMAIL } from "@/lib/site-config";

const SERVICES = [
  { href: "/#servicios", label: "Reparación y diagnóstico" },
  { href: "/#servicios", label: "Reflasheo / Tasmota / ESPHome" },
  { href: "/#servicios", label: "Desbrickeado y bootloader" },
  { href: "/#precios", label: "Tarifario" },
  { href: "/#opiniones", label: "Opiniones de clientes" },
] as const;

export function Footer() {
  return (
    <footer className="bg-[#191C21] text-[#C9C2B5] text-xs font-mono border-t border-[#FF5500]/20">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#FF5500] text-white flex items-center justify-center shadow-sm border border-[#D94800]">
                <Wrench className="w-4.5 h-4.5 -rotate-45" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-[#FAF8F3] tracking-tight font-sans">
                  CHISPA<span className="text-[#FF5500]">32</span>
                </span>
                <span className="text-[9px] bg-[#2A3038] text-[#A6ACB8] px-2 py-0.5 rounded border border-[#3A414C] uppercase tracking-wider">
                  Taller
                </span>
              </div>
            </div>

            <p className="text-[#A6ACB8] text-xs leading-relaxed max-w-md font-sans">
              Banco de servicio técnico para microcontroladores ESP32, ESP8266 e IoT.
              Diagnóstico, reflasheo, recuperación de bootloader y puesta a punto para
              domótica local.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-[#8C929E]">
              <MapPin className="w-3.5 h-3.5 text-[#FF5500] shrink-0" />
              <span>Rosario, Santa Fe — recepción local y envíos a todo el país</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-3 text-xs tracking-wide text-[#FF5500] uppercase">
              Servicios
            </h4>
            <ul className="space-y-2 text-[11px]">
              {SERVICES.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[#C9C2B5] hover:text-[#FAF8F3] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3 text-xs tracking-wide text-[#FF5500] uppercase">
              Contacto
            </h4>
            <ul className="space-y-2.5 text-[11px]">
              <li>
                <a
                  href={whatsappUrl(
                    "Hola Chispa32 — tengo una consulta sobre una placa ESP32"
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#FAF8F3] hover:text-[#FF5500] transition-colors font-bold"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                  WhatsApp directo
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${WORKSHOP_EMAIL}`}
                  className="inline-flex items-center gap-1.5 text-[#C9C2B5] hover:text-[#FAF8F3] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#FF5500]" />
                  {WORKSHOP_EMAIL}
                </a>
              </li>
              <li className="inline-flex items-center gap-1.5 text-[#8C929E]">
                <Cpu className="w-3.5 h-3.5 text-[#FF5500]" />
                <span>ESP32 / ESP8266 / IoT</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#2E353D] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#8C929E]">
          <p>
            © {new Date().getFullYear()} Chispa32 — Taller técnico ESP32 · Rosario,
            Argentina. Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-[#8C929E] hover:text-[#FF5500] transition-colors"
              title="Acceso administrativo"
            >
              <Lock className="w-3 h-3" />
              <span>Acceso admin</span>
            </Link>
            <span className="text-[#5E666F]">Banco de pruebas · RMA</span>
          </div>
        </div>
      </div>

      <style>{`
        :where(.xepw-crafted){--xepw-bg:#131920;--xepw-ink:rgba(250,248,243,.62);--xepw-ink-hover:rgba(250,248,243,.95);--xepw-accent:#FF5500;--xepw-accent-soft:#FF8A4C;--xepw-line:rgba(255,85,0,.2);--xepw-badge:rgba(255,255,255,.03);--xepw-border:rgba(255,85,0,.14);--xepw-border-hover:rgba(255,85,0,.34);--xepw-glow:rgba(255,85,0,.18);position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:1.15rem 1rem;background:var(--xepw-bg);border-top:1px solid var(--xepw-line);width:100%}
        @media (prefers-color-scheme: light){:where(.xepw-crafted){--xepw-bg:#131920;--xepw-ink:rgba(250,248,243,.62);--xepw-ink-hover:rgba(250,248,243,.95);--xepw-accent:#FF5500;--xepw-accent-soft:#FF8A4C;--xepw-line:rgba(255,85,0,.2);--xepw-badge:rgba(255,255,255,.03);--xepw-border:rgba(255,85,0,.14);--xepw-border-hover:rgba(255,85,0,.34);--xepw-glow:rgba(255,85,0,.18)}}
        :where(.xepw-crafted)::before{content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);width:280px;height:1px;background:linear-gradient(90deg,transparent,var(--xepw-accent),transparent)}
        :where(.xepw-crafted) .xepw-sig-glow{position:absolute;inset:50% auto auto 50%;transform:translate(-50%,-50%);width:340px;height:340px;border-radius:50%;background:radial-gradient(circle,rgba(255,85,0,.14) 0%,transparent 70%);pointer-events:none;animation:xepw-sig-pulse 4s ease-in-out infinite}
        :where(.xepw-crafted) .xepw-sig-link{position:relative;z-index:1;display:inline-flex;align-items:center;gap:.6rem;padding:.45rem 1.1rem;border-radius:9999px;text-decoration:none;background:var(--xepw-badge);border:1px solid var(--xepw-border);font-family:'Plus Jakarta Sans','Inter',system-ui,-apple-system,sans-serif;font-size:.75rem;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--xepw-ink);transition:color .4s cubic-bezier(.16,1,.3,1),background .4s ease,border-color .4s ease,box-shadow .4s ease,transform .4s cubic-bezier(.16,1,.3,1)}
        :where(.xepw-crafted) .xepw-sig-link:hover{color:var(--xepw-ink-hover);background:rgba(255,85,0,.08);border-color:var(--xepw-border-hover);box-shadow:0 0 25px var(--xepw-glow),0 0 60px rgba(255,85,0,.08);transform:translateY(-2px)}
        :where(.xepw-crafted) .xepw-sig-shimmer{position:absolute;inset:0;border-radius:inherit;overflow:hidden;pointer-events:none}
        :where(.xepw-crafted) .xepw-sig-shimmer::after{content:'';position:absolute;top:0;left:0;width:60%;height:100%;background:linear-gradient(110deg,transparent,rgba(255,255,255,.14),transparent);transform:translateX(-120%);transition:transform .9s cubic-bezier(.16,1,.3,1)}
        :where(.xepw-crafted) .xepw-sig-link:hover .xepw-sig-shimmer::after{transform:translateX(260%)}
        :where(.xepw-crafted) .xepw-sig-prefix{font-weight:400;opacity:.75;white-space:nowrap}
        :where(.xepw-crafted) .xepw-sig-brand{font-weight:700;background:linear-gradient(135deg,var(--xepw-accent-soft) 0%,var(--xepw-accent) 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;white-space:nowrap}
        :where(.xepw-crafted) .xepw-sig-sparkle{color:var(--xepw-accent-soft);font-size:.85rem;line-height:1;display:inline-block;transition:transform .6s cubic-bezier(.34,1.56,.64,1),color .3s ease}
        :where(.xepw-crafted) .xepw-sig-link:hover .xepw-sig-sparkle{transform:rotate(180deg) scale(1.3);color:var(--xepw-accent)}
        @media (max-width:768px){:where(.xepw-crafted) .xepw-sig-prefix{display:none}:where(.xepw-crafted) .xepw-sig-link{letter-spacing:.14em}}
        @media (prefers-reduced-motion: reduce){:where(.xepw-crafted) .xepw-sig-glow{animation:none}:where(.xepw-crafted) .xepw-sig-shimmer::after{transition:none;transform:none}:where(.xepw-crafted) .xepw-sig-sparkle{transition:none}}
        @keyframes xepw-sig-pulse{0%,100%{opacity:.35;transform:translate(-50%,-50%) scale(.92)}50%{opacity:.85;transform:translate(-50%,-50%) scale(1.05)}}
      `}</style>
      <div className="xepw-crafted" role="contentinfo">
        <div className="xepw-sig-glow" aria-hidden="true"></div>
        <a
          className="xepw-sig-link"
          href="https://exepaginasweb.com"
          target="_blank"
          rel="noopener noreferrer"
          title="Diseño & Desarrollo por Exepaginasweb.com"
        >
          <span className="xepw-sig-shimmer" aria-hidden="true"></span>
          <span className="xepw-sig-prefix">Crafted with precision by</span>
          <span className="xepw-sig-brand">Exepaginasweb.com</span>
          <span className="xepw-sig-sparkle" aria-hidden="true">✦</span>
        </a>
      </div>
    </footer>
  );
}
