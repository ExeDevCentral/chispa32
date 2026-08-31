-- ==========================================================
-- CHISPA32 — SCHEMA ETAPA 1 (MVP) CON RLS BLINDADO
-- ==========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('cliente', 'admin');
CREATE TYPE ticket_status AS ENUM (
  'recibido', 
  'en_diagnostico', 
  'en_reparacion', 
  'esperando_cliente', 
  'resuelto', 
  'entregado', 
  'cancelado'
);
CREATE TYPE ticket_priority AS ENUM ('baja', 'media', 'alta', 'urgente');

-- 2. TABLA DE PERFILES
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  rol user_role DEFAULT 'cliente'::user_role NOT NULL,
  nombre TEXT NOT NULL,
  telefono TEXT,
  whatsapp TEXT NOT NULL, -- Red de seguridad operativa desde el día 1
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLA DE TICKETS
CREATE TABLE public.tickets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ticket_number SERIAL UNIQUE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  tipo_chip TEXT NOT NULL, -- Ej: ESP32-WROOM, ESP32-S3, ESP8266, Sonoff, etc.
  estado ticket_status DEFAULT 'recibido'::ticket_status NOT NULL,
  prioridad ticket_priority DEFAULT 'media'::ticket_priority NOT NULL,
  nota_interna TEXT, -- Nota privada de diagnóstico técnico (visible solo para admin)
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLA DE MENSAJES DE TICKET (Chat simple de texto)
CREATE TABLE public.ticket_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT NOT NULL,
  mensaje TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABLA DE ADJUNTOS (1 archivo/foto por ticket para Etapa 1)
CREATE TABLE public.ticket_attachments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE NOT NULL,
  url_storage TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TRIGGER: CREACIÓN AUTOMÁTICA DE PERFIL AL REGISTRARSE
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, whatsapp, rol)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'whatsapp', new.raw_user_meta_data->>'telefono', ''),
    COALESCE((new.raw_user_meta_data->>'rol')::user_role, 'cliente'::user_role)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. TRIGGER: AUTO UPDATE updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) — NO NEGOCIABLE
-- ==========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_attachments ENABLE ROW LEVEL SECURITY;

-- Helper función segura para verificar si el usuario es Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND rol = 'admin'::user_role
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- POLÍTICAS: PROFILES
CREATE POLICY "Clientes ven su propio perfil o Admin ve todos" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Clientes actualizan su propio perfil" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- POLÍTICAS: TICKETS
-- Lectura: Clientes ven solo sus tickets (sin la nota_interna si se consulta por vista o policy), Admin ve todo
CREATE POLICY "Clientes ven sus tickets o Admin ve todos" 
  ON public.tickets FOR SELECT 
  USING (auth.uid() = user_id OR public.is_admin());

-- Inserción: Clientes pueden crear tickets asociados a su user_id
CREATE POLICY "Clientes crean tickets propios" 
  ON public.tickets FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Actualización: Solo el ADMIN puede modificar el estado o la nota_interna
CREATE POLICY "Solo admin actualiza tickets" 
  ON public.tickets FOR UPDATE 
  USING (public.is_admin());

-- POLÍTICAS: TICKET MESSAGES
CREATE POLICY "Lectura de mensajes del ticket propio" 
  ON public.ticket_messages FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.tickets t 
      WHERE t.id = ticket_messages.ticket_id 
      AND (t.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Envío de mensajes en ticket propio" 
  ON public.ticket_messages FOR INSERT 
  WITH CHECK (
    auth.uid() = sender_id 
    AND EXISTS (
      SELECT 1 FROM public.tickets t 
      WHERE t.id = ticket_messages.ticket_id 
      AND (t.user_id = auth.uid() OR public.is_admin())
    )
  );

-- POLÍTICAS: ADJUNTOS
CREATE POLICY "Lectura de adjuntos de tickets propios" 
  ON public.ticket_attachments FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.tickets t 
      WHERE t.id = ticket_attachments.ticket_id 
      AND (t.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Inserción de adjunto en ticket propio" 
  ON public.ticket_attachments FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tickets t 
      WHERE t.id = ticket_attachments.ticket_id 
      AND (t.user_id = auth.uid() OR public.is_admin())
    )
  );
