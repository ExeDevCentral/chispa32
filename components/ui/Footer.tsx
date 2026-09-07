import Link from "next/link";
import { BookOpen, MapPin, Mail, MessageSquare, Lock } from "lucide-react";
import { whatsappUrl, WORKSHOP_EMAIL } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="bg-[#F8F6F0]/90 backdrop-blur-sm text-[#595245] text-xs font-mono">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#0F1B2D] text-[#C8A84E] flex items-center justify-center font-black">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-[#1A1A2E] tracking-tight">
                NOEMA
              </span>
              <span className="text-[9px] bg-[#EDE9E0] text-[#595245] px-2 py-0.5 rounded border border-[#D6CEC0]">
                Investigación y Estudios
              </span>
            </div>
            <p className="text-[#595245] text-xs leading-relaxed max-w-md font-sans">
              Estudios de investigación y consultoría metodológica integral en Paraguay. Relevamiento de campo, encuestas, focus groups y análisis estratégico.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#736B5E]">
              <MapPin className="w-3.5 h-3.5 text-[#C8A84E]" />
              <span>Asunción / Encarnación — todo el territorio paraguayo</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-3 text-xs tracking-wide text-[#C8A84E]">
              Servicios
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link href="/#servicios" className="hover:text-[#1A1A2E] transition-colors">Relevamiento de Campo</Link></li>
              <li><Link href="/#servicios" className="hover:text-[#1A1A2E] transition-colors">Encuestas y Focus Groups</Link></li>
              <li><Link href="/#servicios" className="hover:text-[#1A1A2E] transition-colors">Estudios de Mercado</Link></li>
              <li><Link href="/#servicios" className="hover:text-[#1A1A2E] transition-colors">Opinión Pública</Link></li>
              <li><Link href="/#opiniones" className="hover:text-[#1A1A2E] transition-colors">Opiniones de Clientes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3 text-xs tracking-wide text-[#C8A84E]">
              Contacto
            </h4>
            <ul className="space-y-2.5 text-[11px]">
              <li>
                <a 
                  href={whatsappUrl("Hola NOEMA — tengo una consulta sobre un estudio de investigación")}
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#1A1A2E] hover:text-[#C8A84E] transition-colors font-bold"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#2E7D32]" />
                  WhatsApp directo
                </a>
              </li>
              <li>
                <a 
                  href={`mailto:${WORKSHOP_EMAIL}`} 
                  className="inline-flex items-center gap-1.5 text-[#595245] hover:text-[#1A1A2E] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#C8A84E]" />
                  {WORKSHOP_EMAIL}
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-[#EDE9E0] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#736B5E]">
          <p>© {new Date().getFullYear()} NOEMA — Investigación y Estudios · Paraguay. Todos los derechos reservados.</p>
          
          <div className="flex items-center gap-4">
            <Link href="/admin" className="inline-flex items-center gap-1 text-[#736B5E] hover:text-[#C8A84E] transition-colors" title="Acceso administrativo">
              <Lock className="w-3 h-3" />
              <span>Acceso admin</span>
            </Link>
            <div className="flex items-center gap-1">
              <span>Investigación social · Paraguay</span>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        :where(.xepw-crafted){--xepw-bg:#162330;--xepw-ink:rgba(250,248,245,.6);--xepw-ink-hover:rgba(250,248,245,.95);--xepw-accent:#C88A6E;--xepw-accent-soft:#E8BFAC;--xepw-line:rgba(200,138,110,.18);--xepw-badge:rgba(255,255,255,.03);--xepw-border:rgba(200,138,110,.12);--xepw-border-hover:rgba(200,138,110,.3);--xepw-glow:rgba(200,138,110,.2);position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:1.15rem 1rem;background:var(--xepw-bg);border-top:1px solid var(--xepw-line);width:100%}
        @media (prefers-color-scheme: light){:where(.xepw-crafted){--xepw-bg:#FAF8F5;--xepw-ink:rgba(27,42,56,.66);--xepw-ink-hover:rgba(27,42,56,.95);--xepw-accent:#A66A4E;--xepw-accent-soft:#8A503C;--xepw-line:rgba(166,106,78,.18);--xepw-badge:rgba(27,42,56,.03);--xepw-border:rgba(166,106,78,.15);--xepw-border-hover:rgba(166,106,78,.35);--xepw-glow:rgba(166,106,78,.18)}}
        :where(.xepw-crafted)::before{content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);width:280px;height:1px;background:linear-gradient(90deg,transparent,var(--xepw-accent),transparent)}
        :where(.xepw-crafted) .xepw-sig-glow{position:absolute;inset:50% auto auto 50%;transform:translate(-50%,-50%);width:340px;height:340px;border-radius:50%;background:radial-gradient(circle,rgba(200,138,110,.18) 0%,transparent 70%);pointer-events:none;animation:xepw-sig-pulse 4s ease-in-out infinite}
        :where(.xepw-crafted) .xepw-sig-link{position:relative;z-index:1;display:inline-flex;align-items:center;gap:.6rem;padding:.45rem 1.1rem;border-radius:9999px;text-decoration:none;background:var(--xepw-badge);border:1px solid var(--xepw-border);font-family:'Plus Jakarta Sans','Inter',system-ui,-apple-system,sans-serif;font-size:.75rem;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--xepw-ink);transition:color .4s cubic-bezier(.16,1,.3,1),background .4s ease,border-color .4s ease,box-shadow .4s ease,transform .4s cubic-bezier(.16,1,.3,1)}
        :where(.xepw-crafted) .xepw-sig-link:hover{color:var(--xepw-ink-hover);background:rgba(200,138,110,.08);border-color:var(--xepw-border-hover);box-shadow:0 0 25px var(--xepw-glow),0 0 60px rgba(200,138,110,.08);transform:translateY(-2px)}
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
        :where(.xepw-crafted){--xepw-bg:#162330;--xepw-ink:rgba(250,248,245,.6);--xepw-ink-hover:rgba(250,248,245,.95);--xepw-accent:#C88A6E;--xepw-accent-soft:#E8BFAC;--xepw-line:rgba(200,138,110,.18);--xepw-badge:rgba(255,255,255,.03);--xepw-border:rgba(200,138,110,.12);--xepw-border-hover:rgba(200,138,110,.3);--xepw-glow:rgba(200,138,110,.2)}
      `}</style>
      <div className="xepw-crafted" role="contentinfo">
        <div className="xepw-sig-glow" aria-hidden="true"></div>
        <a className="xepw-sig-link" href="https://exepaginasweb.com" target="_blank" rel="noopener noreferrer" title="Diseño & Desarrollo por Exepaginasweb.com">
          <span className="xepw-sig-shimmer" aria-hidden="true"></span>
          <span className="xepw-sig-prefix">Crafted with precision by</span>
          <span className="xepw-sig-brand">Exepaginasweb.com</span>
          <span className="xepw-sig-sparkle" aria-hidden="true">✦</span>
        </a>
      </div>
    </footer>
  );
}
