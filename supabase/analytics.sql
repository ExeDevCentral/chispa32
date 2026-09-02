-- ==========================================================
-- CHISPA32 — MIGRACIÓN ANALÍTICA (IDEMPOTENTE)
-- Aplica sobre una base ya existente sin perder datos.
-- Separa la información de pedidos para poder analizarla en el futuro:
--   · tickets: nuevas columnas de segmentación (tipo de trabajo, origen, modo, costos, fechas)
--   · ticket_status_history: historial de cada cambio de estado (medir tiempos por fase)
--   · ticket_payments: pagos / cobros por pedido (facturación y márgenes)
--   · ticket_parts: repuestos / insumos usados por pedido
-- ==========================================================

-- 1. NUEVAS COLUMNAS EN tickets (seguro: solo añade si faltan)
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS tipo_trabajo TEXT;
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS marca_dispositivo TEXT;
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS origen TEXT DEFAULT 'web';
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS modo_servicio TEXT DEFAULT 'presencial';
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS costo_repuestos NUMERIC DEFAULT 0;
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS fecha_ingreso TIMESTAMPTZ DEFAULT timezone('utc'::text, now());
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS fecha_entrega TIMESTAMPTZ;
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS fecha_cancelacion TIMESTAMPTZ;

-- Backfill: en tickets existentes sin fecha_ingreso, usar created_at
UPDATE public.tickets
SET fecha_ingreso = created_at
WHERE fecha_ingreso IS NULL;

-- 2. ÍNDICES DE APOYO ANALÍTICO
CREATE INDEX IF NOT EXISTS tickets_estado_idx ON public.tickets (estado);
CREATE INDEX IF NOT EXISTS tickets_tipo_chip_idx ON public.tickets (tipo_chip);
CREATE INDEX IF NOT EXISTS tickets_tipo_trabajo_idx ON public.tickets (tipo_trabajo);
CREATE INDEX IF NOT EXISTS tickets_created_at_idx ON public.tickets (created_at);

-- 3. HISTORIAL DE CAMBIOS DE ESTADO
CREATE TABLE IF NOT EXISTS public.ticket_status_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE NOT NULL,
  estado_anterior ticket_status,
  estado_nuevo ticket_status NOT NULL,
  usuario TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS ticket_status_history_ticket_idx ON public.ticket_status_history (ticket_id);
CREATE INDEX IF NOT EXISTS ticket_status_history_estado_idx ON public.ticket_status_history (estado_nuevo);

-- 4. PAGOS / COBROS POR PEDIDO
CREATE TABLE IF NOT EXISTS public.ticket_payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE NOT NULL,
  monto NUMERIC NOT NULL DEFAULT 0,
  metodo TEXT DEFAULT 'efectivo',
  estado TEXT DEFAULT 'pendiente',
  fecha_pago TIMESTAMPTZ,
  nota TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS ticket_payments_ticket_idx ON public.ticket_payments (ticket_id);
CREATE INDEX IF NOT EXISTS ticket_payments_estado_idx ON public.ticket_payments (estado);

-- 5. REPUESTOS / INSUMOS USADOS POR PEDIDO
CREATE TABLE IF NOT EXISTS public.ticket_parts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE NOT NULL,
  nombre TEXT NOT NULL,
  cantidad NUMERIC DEFAULT 1,
  costo_unitario NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS ticket_parts_ticket_idx ON public.ticket_parts (ticket_id);

-- 6. RLS EN NUEVAS TABLAS
ALTER TABLE public.ticket_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_parts ENABLE ROW LEVEL SECURITY;

-- 7. POLÍTICAS RLS
DROP POLICY IF EXISTS "Lectura historial" ON public.ticket_status_history;
CREATE POLICY "Lectura historial" ON public.ticket_status_history FOR SELECT USING (true);
DROP POLICY IF EXISTS "Escritura historial admin" ON public.ticket_status_history;
CREATE POLICY "Escritura historial admin" ON public.ticket_status_history FOR ALL USING (public.is_super_admin());

DROP POLICY IF EXISTS "Lectura pagos" ON public.ticket_payments;
CREATE POLICY "Lectura pagos" ON public.ticket_payments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Escritura pagos admin" ON public.ticket_payments;
CREATE POLICY "Escritura pagos admin" ON public.ticket_payments FOR ALL USING (public.is_super_admin());

DROP POLICY IF EXISTS "Lectura repuestos" ON public.ticket_parts;
CREATE POLICY "Lectura repuestos" ON public.ticket_parts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Escritura repuestos admin" ON public.ticket_parts;
CREATE POLICY "Escritura repuestos admin" ON public.ticket_parts FOR ALL USING (public.is_super_admin());
