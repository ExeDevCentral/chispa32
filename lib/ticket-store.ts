"use client";

import { useState, useEffect } from "react";
import { Ticket, TicketStatus, TicketMessage, UserRole } from "@/types";
import { INITIAL_TICKETS } from "./mock-data";

const STORAGE_KEY = "chispa32_tickets_etapa1";
const ROLE_KEY = "chispa32_user_role";

export function useTicketStore() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [currentRole, setCurrentRole] = useState<UserRole>("cliente");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setTickets(JSON.parse(saved));
      } else {
        setTickets(INITIAL_TICKETS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TICKETS));
      }

      const savedRole = localStorage.getItem(ROLE_KEY) as UserRole;
      if (savedRole) {
        setCurrentRole(savedRole);
      }
    } catch {
      setTickets(INITIAL_TICKETS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveTickets = (updated: Ticket[]) => {
    setTickets(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Error guardando tickets:", e);
    }
  };

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    try {
      localStorage.setItem(ROLE_KEY, role);
    } catch (e) {
      console.error("Error guardando rol:", e);
    }
  };

  const createTicket = async (ticketData: Omit<Ticket, "id" | "ticket_number" | "created_at" | "updated_at">) => {
    const nextNumber = tickets.length > 0 ? Math.max(...tickets.map((t) => t.ticket_number)) + 1 : 101;
    const now = new Date().toISOString();
    const newTicket: Ticket = {
      ...ticketData,
      id: `tk-${Date.now()}`,
      ticket_number: nextNumber,
      created_at: now,
      updated_at: now,
      messages: ticketData.messages || [],
    };

    const updated = [newTicket, ...tickets];
    saveTickets(updated);

    // Trigger de alerta a Telegram
    try {
      fetch("/api/tickets/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketNumber: newTicket.ticket_number,
          clienteNombre: newTicket.user_nombre || "Cliente Chispa32",
          modeloPlaca: newTicket.tipo_chip,
          tipoProblema: newTicket.tipo_chip,
          titulo: newTicket.titulo,
          descripcion: newTicket.descripcion,
          ticketId: newTicket.id,
        }),
      }).catch((e) => console.log("Telegram alert error:", e));
    } catch {
      // Continuar sin bloquear
    }

    return newTicket;
  };

  const updateTicketStatus = (ticketId: string, newStatus: TicketStatus) => {
    const updated = tickets.map((t) => {
      if (t.id === ticketId) {
        return {
          ...t,
          estado: newStatus,
          updated_at: new Date().toISOString(),
        };
      }
      return t;
    });
    saveTickets(updated);
  };

  const updateInternalNote = (ticketId: string, note: string) => {
    const updated = tickets.map((t) => {
      if (t.id === ticketId) {
        return {
          ...t,
          nota_interna: note,
          updated_at: new Date().toISOString(),
        };
      }
      return t;
    });
    saveTickets(updated);
  };

  const addMessage = (
    ticketId: string,
    messageText: string,
    senderId: string,
    senderName: string,
    senderRole: UserRole
  ) => {
    const now = new Date().toISOString();
    const newMessage: TicketMessage = {
      id: `msg-${Date.now()}`,
      ticket_id: ticketId,
      sender_id: senderId,
      sender_name: senderName,
      sender_role: senderRole,
      mensaje: messageText,
      created_at: now,
    };

    const updated = tickets.map((t) => {
      if (t.id === ticketId) {
        return {
          ...t,
          updated_at: now,
          messages: [...(t.messages || []), newMessage],
        };
      }
      return t;
    });

    saveTickets(updated);

    // Alerta a Telegram si el mensaje lo envía el cliente
    if (senderRole === "cliente") {
      const ticket = tickets.find((t) => t.id === ticketId);
      try {
        fetch("/api/tickets/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ticketNumber: ticket?.ticket_number || ticketId,
            remitente: senderName,
            mensaje: messageText,
            ticketId: ticketId,
            type: "message",
          }),
        }).catch((e) => console.log("Telegram alert error:", e));
      } catch {
        // Continuar
      }
    }

    return newMessage;
  };

  return {
    tickets,
    currentRole,
    isLoaded,
    switchRole,
    createTicket,
    updateTicketStatus,
    updateInternalNote,
    addMessage,
  };
}
