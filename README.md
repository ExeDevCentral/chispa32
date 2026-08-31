# Chispa32 ⚡ — Taller de Servicio Técnico ESP32 / IoT (Rosario)

Plataforma web completa para el servicio técnico especializado en microcontroladores **ESP32, ESP8266 y desarrollo IoT** en Rosario, Santa Fe, Argentina.

Diseñada bajo el principio de **gestión asincrónica y móvil** para operar durante turnos laborales y descansos.

---

## 🛠️ Stack Tecnológico

- **Frontend:** Next.js 16 (App Router, React 19, TypeScript)
- **Estilos:** Tailwind CSS (Estética *Taller Industrial / Workbench*)
- **Tipografía:** Space Grotesk + JetBrains Mono
- **Backend & Auth:** Supabase (PostgreSQL, Row Level Security, Auth, Storage)
- **Notificaciones Push:** Bot de Telegram (`lib/telegram.ts`)
- **Hosting:** Vercel

---

## 🚀 Inicio Rápido

### 1. Clonar e instalar dependencias
```bash
git clone https://github.com/ExeDevCentral/chispa32.git
cd chispa32
npm install
```

### 2. Variables de Entorno (`.env.local`)
Copiá el archivo de ejemplo y completá tus credenciales:
```bash
cp .env.example .env.local
```

Configurá las variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
TELEGRAM_BOT_TOKEN=tu-bot-token
TELEGRAM_CHAT_ID=tu-chat-id
```

### 3. Base de Datos (Supabase)
Ejecutá el script [supabase/schema.sql](./supabase/schema.sql) en el **SQL Editor** de tu consola de Supabase para inicializar tablas, perfiles, políticas RLS y triggers automáticos.

### 4. Ejecutar localmente
```bash
npm run dev
```
Abrí [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📋 Estructura del Proyecto

```text
chispa32/
├── app/
│   ├── page.tsx                     # Landing page (Hero, Servicios, Tarifas, FAQ)
│   ├── (auth)/                      # Login y Registro con Supabase Auth
│   ├── (dashboard)/panel/           # Panel del Cliente (Órdenes, Creación de ticket, Chat)
│   ├── (dashboard)/admin/           # Banco de Despacho Admin (Notas privadas, WhatsApp, Estados)
│   └── api/tickets/notify/          # Endpoint para alertas a Telegram
├── components/
│   ├── ui/                          # Navbar y Footer de Taller
│   ├── marketing/                   # Hero, ServicesGrid, PricingSection, HowItWorks, FAQ
│   ├── dashboard/                   # RoleSwitcher (Alternar Cliente / Admin)
│   └── tickets/                     # TicketStatusStepper, TicketChat
├── lib/
│   ├── telegram.ts                  # Servicio de alertas push a tu celular
│   ├── ticket-store.ts              # Store de órdenes y sincronización
│   └── utils.ts                     # Formateadores ARS y fechas
├── supabase/
│   └── schema.sql                   # Esquema SQL con RLS blindado
└── types/                           # Interfaces TypeScript
```

---

## 🇦🇷 Rosario & Envíos Nacionales
Desarrollado para atención física en Rosario (Centro, Av. Pellegrini, Pichincha) y envíos por correo al resto de Argentina.
