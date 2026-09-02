-- ==========================================================
-- CHISPA32 — SCHEMA COMPLETO (SUPER ADMIN, TICKETS, REVIEWS, PRECIOS, LINKS)
-- ==========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('cliente', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE ticket_status AS ENUM (
    'recibido', 
    'en_diagnostico', 
    'en_reparacion', 
    'esperando_cliente', 
    'resuelto', 
    'entregado', 
    'cancelado'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE ticket_priority AS ENUM ('baja', 'media', 'alta', 'urgente');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. TABLA DE PERFILES (Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  rol user_role DEFAULT 'cliente'::user_role NOT NULL,
  nombre TEXT NOT NULL,
  avatar_url TEXT,
  telefono TEXT,
  whatsapp TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLA DE TICKETS DE TALLER
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ticket_number SERIAL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_nombre TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_whatsapp TEXT NOT NULL,
  tipo_chip TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  estado ticket_status DEFAULT 'recibido'::ticket_status NOT NULL,
  prioridad ticket_priority DEFAULT 'media'::ticket_priority NOT NULL,
  presupuesto NUMERIC DEFAULT 0,
  nota_interna TEXT,
  adjunto_url TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLA DE MENSAJES / BITÁCORA DEL TICKET
CREATE TABLE IF NOT EXISTS public.ticket_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE NOT NULL,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_role TEXT DEFAULT 'cliente',
  mensaje TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABLA DE ADJUNTOS DE TICKET
CREATE TABLE IF NOT EXISTS public.ticket_attachments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE NOT NULL,
  url_storage TEXT NOT NULL,
  file_name TEXT,
  file_type TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABLA DE RESEÑAS / COMENTARIOS DE CLIENTES (Para el Marquee y Landing)
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_email TEXT NOT NULL,
  user_nombre TEXT NOT NULL,
  user_avatar TEXT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comentario TEXT NOT NULL,
  chip_o_servicio TEXT DEFAULT 'ESP32',
  aprobado BOOLEAN DEFAULT true NOT NULL,
  destacado BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. TABLA DE TARIFARIO Y PRECIOS DEL TALLER
CREATE TABLE IF NOT EXISTS public.workshop_prices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  badge TEXT DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  time TEXT NOT NULL,
  description TEXT NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  highlight BOOLEAN DEFAULT false,
  "order" INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. TABLA DE RESPUESTAS RÁPIDAS (Canned Responses para WhatsApp)
CREATE TABLE IF NOT EXISTS public.quick_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  titulo TEXT NOT NULL,
  categoria TEXT NOT NULL,
  texto TEXT NOT NULL,
  variables TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. TABLA DE LINKS ÚTILES DE TALLER
CREATE TABLE IF NOT EXISTS public.quick_links (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  titulo TEXT NOT NULL,
  url TEXT NOT NULL,
  categoria TEXT NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================================
-- SUPER ADMIN RECOGNITION & HELPER FUNCTIONS
-- ==========================================================

-- Helper para verificar si el usuario es Super Admin por Email o Rol
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT (
    (auth.jwt() ->> 'email' = 'echevarriaexequiell@gmail.com')
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (rol = 'admin'::user_role OR email = 'echevarriaexequiell@gmail.com')
    )
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Trigger para creación automática de perfil al registrarse con Google / Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nombre, avatar_url, whatsapp, rol)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', ''),
    COALESCE(new.raw_user_meta_data->>'whatsapp', ''),
    CASE 
      WHEN lower(new.email) = 'echevarriaexequiell@gmail.com' THEN 'admin'::user_role
      ELSE COALESCE((new.raw_user_meta_data->>'rol')::user_role, 'cliente'::user_role)
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    nombre = EXCLUDED.nombre,
    avatar_url = EXCLUDED.avatar_url,
    rol = CASE WHEN lower(EXCLUDED.email) = 'echevarriaexequiell@gmail.com' THEN 'admin'::user_role ELSE profiles.rol END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_links ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS: PROFILES
DROP POLICY IF EXISTS "Lectura de perfiles" ON public.profiles;
CREATE POLICY "Lectura de perfiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Actualizar propio perfil o admin" ON public.profiles;
CREATE POLICY "Actualizar propio perfil o admin" ON public.profiles FOR UPDATE 
  USING (auth.uid() = id OR public.is_super_admin());

-- POLÍTICAS: TICKETS
DROP POLICY IF EXISTS "Lectura de tickets" ON public.tickets;
CREATE POLICY "Lectura de tickets" ON public.tickets FOR SELECT 
  USING (true); -- Permite tracking público por ID/número de ticket o acceso admin

DROP POLICY IF EXISTS "Creación de tickets" ON public.tickets;
CREATE POLICY "Creación de tickets" ON public.tickets FOR INSERT 
  WITH CHECK (true); -- Clientes o visitantes pueden crear tickets

DROP POLICY IF EXISTS "Modificación de tickets solo admin" ON public.tickets;
CREATE POLICY "Modificación de tickets solo admin" ON public.tickets FOR UPDATE 
  USING (public.is_super_admin() OR auth.uid() = user_id);

-- POLÍTICAS: TICKET MESSAGES
DROP POLICY IF EXISTS "Lectura de mensajes" ON public.ticket_messages;
CREATE POLICY "Lectura de mensajes" ON public.ticket_messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Inserción de mensajes" ON public.ticket_messages;
CREATE POLICY "Inserción de mensajes" ON public.ticket_messages FOR INSERT WITH CHECK (true);

-- POLÍTICAS: REVIEWS
DROP POLICY IF EXISTS "Lectura pública de reviews aprobadas" ON public.reviews;
CREATE POLICY "Lectura pública de reviews aprobadas" ON public.reviews FOR SELECT 
  USING (aprobado = true OR public.is_super_admin() OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios autenticados crean review" ON public.reviews;
CREATE POLICY "Usuarios autenticados crean review" ON public.reviews FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios editan su propia review o admin" ON public.reviews;
CREATE POLICY "Usuarios editan su propia review o admin" ON public.reviews FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id OR public.is_super_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_super_admin());

DROP POLICY IF EXISTS "Usuarios o admin borran review" ON public.reviews;
CREATE POLICY "Usuarios o admin borran review" ON public.reviews FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id OR public.is_super_admin());

-- POLÍTICAS: PRECIOS, RESPUESTAS Y LINKS
DROP POLICY IF EXISTS "Lectura pública de precios" ON public.workshop_prices;
CREATE POLICY "Lectura pública de precios" ON public.workshop_prices FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin modifica precios" ON public.workshop_prices;
CREATE POLICY "Admin modifica precios" ON public.workshop_prices FOR ALL USING (public.is_super_admin());

DROP POLICY IF EXISTS "Lectura pública de respuestas" ON public.quick_responses;
CREATE POLICY "Lectura pública de respuestas" ON public.quick_responses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin gestiona respuestas" ON public.quick_responses;
CREATE POLICY "Admin gestiona respuestas" ON public.quick_responses FOR ALL USING (public.is_super_admin());

DROP POLICY IF EXISTS "Lectura pública de links" ON public.quick_links;
CREATE POLICY "Lectura pública de links" ON public.quick_links FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin gestiona links" ON public.quick_links;
CREATE POLICY "Admin gestiona links" ON public.quick_links FOR ALL USING (public.is_super_admin());

-- ==========================================================
-- SEED DATA INICIAL
-- ==========================================================

INSERT INTO public.workshop_prices (name, badge, price, time, description, features, highlight, "order", active)
VALUES 
  ('Diagnóstico & Flasheo Simple', 'TRABAJO BÁSICO', 8500, '24 a 48 hs de banco', 'Para placas que no bootean, quedaron trabadas en un ciclo de reset o requieren erase completo de memoria flash.', '["Lectura de registros y sonda por UART", "Erase físico de memoria SPI Flash", "Restauración de bootloader original", "Test de consumo y riel de 3.3V", "Informe técnico de salida"]'::jsonb, false, 1, true),
  ('Flasheo & Nodo Domótico', 'MÁS SOLICITADO', 12000, '24 a 48 hs de banco', 'Para módulos Sonoff, Shelly o placas que querés dejar integradas localmente en Home Assistant o WLED.', '["Todo lo incluido en Flasheo Simple", "Carga de ESPHome, Tasmota o WLED", "Generación de archivo .yaml a medida", "Configuración de sensores y relés", "Calibración de broker MQTT local", "Guía de conexión para tu red"]'::jsonb, true, 2, true),
  ('Debugging de Código & FreeRTOS', 'PROYECTO COMPLEJO', 18000, '48 a 72 hs', 'Para estudiantes o desarrolladores con código que se cuelga, caídas de memoria Heap o migración a PlatformIO.', '["Auditoría técnica de código fuente", "Detección y corrección de Memory Leaks", "Migración de Arduino a PlatformIO / ESP-IDF", "Separación de tareas en FreeRTOS", "Rutina de Auto-Reconnect WiFi probada", "Garantía de funcionamiento de código"]'::jsonb, false, 3, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.quick_responses (titulo, categoria, texto, variables)
VALUES 
  ('Recepción de Placa', 'Recepción', '¡Hola {cliente}! 👋 Confirmamos el ingreso de tu {chip} al banco de trabajo de Chispa32 (Orden #{orden}). En las próximas 24/48hs te pasamos el reporte de diagnóstico por osciloscopio y UART.', ARRAY['{cliente}', '{chip}', '{orden}']),
  ('Diagnóstico Listo', 'Diagnóstico', 'Hola {cliente}, ya concluimos el diagnóstico de la Orden #{orden} ({chip}). El informe técnico y presupuesto está listo. ¿Avanzamos con la reparación/flasheo?', ARRAY['{cliente}', '{chip}', '{orden}']),
  ('Placa Lista para Retiro', 'Entrega', '¡Buenas noticias {cliente}! Tu placa {chip} (Orden #{orden}) pasó todos los tests en banco y quedó 100% operativa. Podés retirar en Rosario en el punto coordinado.', ARRAY['{cliente}', '{chip}', '{orden}']),
  ('Coordinación de Envío', 'Logística', 'Hola {cliente}, para despachar tu placa por correo precisamos: Nombre completo, DNI, Dirección y Código Postal. Te enviaremos el número de tracking apenas salga.', ARRAY['{cliente}'])
ON CONFLICT DO NOTHING;

INSERT INTO public.quick_links (titulo, url, categoria, descripcion)
VALUES 
  ('ESP Web Tools (Flasher en navegador)', 'https://esphome.github.io/esp-web-tools/', 'Herramientas', 'Flashear ESP32/ESP8266 directo desde Chrome vía WebSerial'),
  ('Espressif Flash Download Tool', 'https://www.espressif.com/en/support/download/other-tools', 'Herramientas', 'Software oficial para erase de flash y binarios'),
  ('ESPHome Official Documentation', 'https://esphome.io/', 'Documentación', 'Referencia de componentes, sensores y configs YAML'),
  ('WLED Releases & Firmware', 'https://install.wled.me/', 'Firmware', 'Instalador web de WLED para tiras NeoPixel y WS2812B')
ON CONFLICT DO NOTHING;
