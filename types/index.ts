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
  email?: string;
  rol: UserRole;
  nombre: string;
  avatar_url?: string;
  telefono?: string;
  whatsapp: string;
  created_at: string;
  updated_at?: string;
}

export interface TicketAttachment {
  id: string;
  ticket_id: string;
  url_storage: string;
  file_name?: string;
  file_type?: string;
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
  user_id?: string | null;
  user_nombre: string;
  user_email: string;
  user_whatsapp: string;
  tipo_chip: string;
  titulo: string;
  descripcion: string;
  estado: TicketStatus;
  prioridad: TicketPriority;
  presupuesto?: number;
  nota_interna?: string;
  adjunto_url?: string;
  messages?: TicketMessage[];
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  user_email: string;
  user_nombre: string;
  user_avatar?: string;
  rating: number; // 1 to 5
  comentario: string;
  chip_o_servicio?: string;
  aprobado: boolean;
  destacado: boolean;
  created_at: string;
  updated_at?: string;
}

export interface WorkshopPrice {
  id: string;
  name: string;
  badge: string;
  price: number;
  time: string;
  description: string;
  features: string[];
  highlight: boolean;
  order: number;
  active: boolean;
}

export interface QuickResponse {
  id: string;
  titulo: string;
  categoria: string;
  texto: string;
  variables?: string[];
}

export interface QuickLink {
  id: string;
  titulo: string;
  url: string;
  categoria: string;
  descripcion?: string;
}
