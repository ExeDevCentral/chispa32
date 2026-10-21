<div align="center">

# Chispa32
### *Industrial IoT Diagnostic Telemetry, Microcontroller Workbench & Asynchronous Servicing Architecture*

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x_Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_RLS-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Telegram Bot API](https://img.shields.io/badge/Telegram_Bot-Webhook_Telemetry-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://core.telegram.org/bots/api)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<p align="center">
  <b>A full-stack, enterprise-hardened servicing and dispatch infrastructure designed for ESP32/ESP8266 embedded firmware diagnostics, board bring-up, and real-time incident lifecycle management.</b>
</p>

---

</div>

## 1. Abstract & Systems Taxonomy

**Chispa32** provides an end-to-end telemetry and operations workbench for hardware engineers, IoT developers, and clients requiring diagnostic repair and firmware validation of Espressif Systems microcontrollers (**ESP32 / ESP8266**). 

Engineered with **Next.js 16 (App Router)** and **Supabase (PostgreSQL with Row Level Security)**, the system manages the asynchronous lifecycle of hardware triage, client communication, differential quote calculation, and bidirectional Telegram webhook notifications.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT & TRIAGE INGESTION                       │
│  [Incident Ticket Submission] ──► [Fault Symptom Diagnostic Vector]    │
│  [Supabase Auth Session]       ──► [Encrypted Payload Storage]         │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│             ROW-LEVEL SECURITY & POSTGRESQL STATE MACHINE              │
│       • Strict RLS Policy Enforcement (Client vs Operator ACL)         │
│       • State Transitions: PENDING ➔ TRIAGED ➔ REPAIR ➔ VALIDATED     │
│       • Transactional Audit Log with Immutable Timestamps              │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
┌──────────────────────────────────┐        ┌──────────────────────────────────┐
│      OPERATOR TELEGRAM RELAY     │        │       REACTIVE CLIENT DASHBOARD  │
│  Low-latency Push Webhook Stream │        │   Real-time Stepper Synchronization│
│  Instant Diagnostic Dispatch     │        │   In-situ Encrypted Ticket Thread│
└──────────────────────────────────┘        └──────────────────────────────────┘
```

---

## 2. Technical Foundations & Embedded Scope

### 2.1. Supported Hardware Profiles & Architecture
The diagnostic dispatch platform handles hardware-level triage across multiple architectures:
- **Espressif Xtensa dual-core 32-bit LX6 & LX7** (ESP32, ESP32-S3)
- **RISC-V 32-bit single-core microarchitectures** (ESP32-C3, ESP32-C6)
- **Legacy Tensilica L106 Diamond** (ESP8266)
- Flash memory corruption recovery, bootloader loop diagnostics, and RF impedance / antenna testing.

### 2.2. Relational Schema & Row Level Security (RLS)
The data layer enforces multi-tenant boundaries directly at the database engine level via PostgreSQL policies:
- **Client Privilege Isolation:** Clients possess read/write authorization strictly restricted to rows matching their authenticated `auth.uid()`.
- **Administrative Override:** Operator dashboards employ elevated role-based access control (RBAC) enabling state transitions, private diagnostic notes, and pricing adjustments.
- **Automated Telegram Telemetry:** Database mutation hooks execute push notifications to engineering terminals via serverless webhook handlers.

---

## 3. Technology Stack

| Layer | Specification | Functionality |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 | React 19 Server Components, App Router, Route Handlers |
| **Styling Engine** | Tailwind CSS v4 | Industrial workbench aesthetic (`Space Grotesk` & `JetBrains Mono`) |
| **Database** | PostgreSQL 15 (Supabase) | ACID transactions, foreign key constraints, Row Level Security |
| **Authentication** | Supabase Auth | Cryptographic JWT session validation and cookie exchange |
| **Notifications** | Telegram Bot API | Asynchronous serverless push delivery (`lib/telegram.ts`) |
| **Deployment** | Vercel Edge Network | Global CDN routing and edge middleware execution |

---

## 4. Systems Directory Structure

```text
chispa32/
├── app/
│   ├── page.tsx                     # Landing page with service specs & technical FAQ
│   ├── (auth)/                      # Cryptographic authentication flows
│   ├── (dashboard)/panel/           # Client Incident Tracking Portal & Live Thread
│   ├── (dashboard)/admin/           # Engineering Workbench, Private Notes & Dispatch
│   └── api/tickets/notify/          # Serverless Telegram Webhook Notification Endpoint
├── components/
│   ├── ui/                          # Design primitives & industrial workbench shell
│   ├── marketing/                   # Technical specs, tiered pricing & diagnostic roadmap
│   ├── dashboard/                   # Operator/Client context switcher
│   └── tickets/                     # Lifecycle stepper & synchronized incident chat
├── lib/
│   ├── telegram.ts                  # Webhook alert dispatch service
│   ├── ticket-store.ts              # Optimistic state synchronization layer
│   └── utils.ts                     # Monetary and temporal formatting utilities
├── supabase/
│   └── schema.sql                   # Hardened SQL DDL with automated triggers & RLS
└── types/                           # Strict TypeScript interface declarations
```

---

## 5. Development Sandbox & Configuration

### Prerequisites
- **Node.js**: $\ge 20.x$
- **Supabase CLI** or active Supabase cloud project

### Installation Lifecycle
```bash
# Clone the repository
git clone https://github.com/ExeDevCentral/chispa32.git
cd chispa32

# Install dependencies deterministically
npm install
```

### Environment Variables (`.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
```

### Database Schema Initialization
Execute the SQL migration payload within `supabase/schema.sql` inside the Supabase SQL Console to initialize tables, relational triggers, and RLS policies.

### Local Runtime Execution
```bash
# Launch Next.js 16 development server
npm run dev
```

---

## 6. License

Distributed under the **MIT License**. Engineered for embedded systems maintenance and mission-critical IoT prototyping.

<div align="center">
  <sub>Maintained with engineering rigor by <a href="https://github.com/ExeDevCentral">ExeDevCentral</a>.</sub>
</div>
