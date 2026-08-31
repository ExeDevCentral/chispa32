export type UserRole = 'cliente' | 'admin';

export type TicketStatus = 
  | 'recibido' 
  | 'en_diagnostico' 
  | 'en_reparacion' 
  | 'esperando_cliente' 
  | 'resuelto' 
  | 'entregado' 
  | 'cancelado';

export type TicketPriority = 'baja' | 'media' | 'alta' | 'urgente';

export interface Profile {
  id: string;
  rol: UserRole;
  nombre: string;
  telefono?: string;
  whatsapp: string; // Contacto alternativo obligatorio desde el día 1
  created_at: string;
  updated_at?: string;
}

export interface TicketAttachment {
  id: string;
  ticket_id: string;
  url_storage: string;
  created_at: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_name?: string;
  sender_role?: UserRole;
  mensaje: string;
  created_at: string;
}

export interface Ticket {
  id: string;
  ticket_number: number;
  user_id: string;
  user_nombre?: string;
  user_email?: string;
  user_whatsapp?: string; // Red de seguridad operativa
  titulo: string;
  descripcion: string;
  tipo_chip: string; // Ej: ESP32-WROOM, ESP32-S3, ESP8266, Sonoff, etc.
  estado: TicketStatus;
  prioridad: TicketPriority;
  nota_interna?: string; // Privada solo para Admin
  adjunto_url?: string; // 1 adjunto en Etapa 1
  messages?: TicketMessage[];
  created_at: string;
  updated_at: string;
}
