import Link from "next/link";
import { Wrench, Home, Code2, Wifi, Cpu, Lightbulb, ArrowRight, Check } from "lucide-react";

const WORKSHOP_SERVICES = [
  {
    code: "SRV-01",
    icon: Wrench,
    title: "Desbrickeado & Recuperación de Flash",
    tag: "Banco de Flasheo",
    description: "Para placas que quedaron en boot loop tras un update OTA fallido, no responden a esptool o tienen la memoria SPI corrupta. Restauramos bootloader y particiones de fábrica.",
    bullets: [
      "Lectura y erase completo de memoria SPI",
      "Restauración de particiones NVS / SPIFFS / LittleFS",
      "Revisión de strapping pins (GPIO0 / GPIO2 / GPIO12 / EN)",
    ],
  },
  {
    code: "SRV-02",
    icon: Home,
    title: "Flasheo ESPHome & Tasmota (Domótica)",
    tag: "Integración Local",
    description: "Liberamos módulos comerciales (Sonoff, Shelly, relés Tuya) o placas genéricas de la nube del fabricante. Las dejamos 100% locales listas para Home Assistant.",
    bullets: [
      "Flasheo por pines UART de módulos Sonoff/Shelly",
      "Generación de archivo de configuración .yaml listo",
      "Telemetría MQTT local y control sin internet",
    ],
  },
  {
    code: "SRV-03",
    icon: Code2,
    title: "Debugging de Firmware & FreeRTOS",
    tag: "Código C++ / C",
    description: "¿Tu código en Arduino IDE se cuelga a las 3 horas de funcionar? Migramos a PlatformIO / ESP-IDF, aislamos fugas de memoria Heap y configuramos tareas FreeRTOS.",
    bullets: [
      "Migración Arduino IDE ↔ PlatformIO / ESP-IDF",
      "Control de memoria dinámica (evitar crashes de Heap)",
      "Separación de tareas en Core 0 y Core 1",
    ],
  },
  {
    code: "SRV-04",
    icon: Wifi,
    title: "Corrección de Conectividad WiFi & MQTT",
    tag: "Redes & RF",
    description: "Solucionamos caídas periódicas de WiFi, fallas de reconexión automática tras cortes de router y pérdida de paquetes en brokers MQTT.",
    bullets: [
      "Rutinas de reconexión no bloqueantes",
      "Configuración de portal cautivo WiFiManager",
      "Calibración de timeout y Keep-Alive MQTT",
    ],
  },
  {
    code: "SRV-05",
    icon: Cpu,
    title: "Controladoras LED WLED & Iluminación",
    tag: "Hardware LED",
    description: "Puesta a punto de microcontroladores para tiras direccionables (WS2812B, WS2811, SK6812). Sincronización de efectos, macros y control por app local.",
    bullets: [
      "Carga de WLED estándar o reactivo al sonido",
      "Cálculo de líneas de inyección de potencia",
      "Integración con red local y presets",
    ],
  },
  {
    code: "SRV-06",
    icon: Lightbulb,
    title: "Asesoramiento Técnico para Makers y Alumnos",
    tag: "Consultoría 1 a 1",
    description: "Si estás trabado con tu proyecto final de facultad, tesis de escuela técnica o prototipo personal, te ayudamos a destrabar el hardware y software en pocas horas.",
    bullets: [
      "Revisión de esquemáticos y pines de strapping",
      "Selección adecuada de fuentes y reguladores 3.3V",
      "Auditoría técnica de código fuente",
    ],
  },
];

export function ServicesGrid() {
  return (
    <section id="servicios" className="py-16 sm:py-20 bg-[#FAF8F3] border-b-2 border-[#D6CEC0]">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header de Sección */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EAE3D5] text-[#191C21] rounded font-mono text-xs font-bold uppercase tracking-wider border border-[#D0C7B6]">
            <span>CATÁLOGO DE SERVICIO TÉCNICO</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#191C21] uppercase mt-3 tracking-tight">
            Trabajos de Banco y Especialidades
          </h2>
          <p className="text-[#595245] mt-2 text-sm sm:text-base font-medium">
            Instrumental de medición, herramientas de flasheo a bajo nivel y conocimiento práctico en microcontroladores.
          </p>
        </div>

        {/* Grid de Trabajos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WORKSHOP_SERVICES.map((srv, idx) => {
            const Icon = srv.icon;

            return (
              <div 
                key={idx}
                className="bg-[#F3EFE6] border-2 border-[#D6CEC0] hover:border-[#FF5500] rounded-xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-[#D6CEC0] pb-3">
                    <span className="font-mono font-bold text-xs text-[#FF5500] bg-[#FAF8F3] px-2 py-0.5 rounded border border-[#E0D8C8]">
                      {srv.code}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#6B6355] uppercase tracking-wider">
                      {srv.tag}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#FAF8F3] border border-[#D0C7B6] flex items-center justify-center text-[#FF5500] shrink-0 group-hover:bg-[#FF5500] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-[#191C21] leading-tight">
                      {srv.title}
                    </h3>
                  </div>

                  <p className="text-[#595245] text-xs leading-relaxed mt-2">
                    {srv.description}
                  </p>

                  <ul className="mt-4 space-y-2 border-t border-[#D6CEC0] pt-4 font-mono text-xs text-[#332E27]">
                    {srv.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#FF5500] shrink-0 mt-0.5" />
                        <span className="text-[11px]">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-[#D6CEC0]">
                  <Link
                    href={`/panel/nuevo-ticket?paquete=${encodeURIComponent(srv.title)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#FF5500] hover:text-[#D94800] uppercase tracking-wider"
                  >
                    Ingresar orden para este trabajo <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
