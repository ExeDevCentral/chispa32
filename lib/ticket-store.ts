"use client";

import { useState, useEffect, useCallback } from "react";
import { Ticket, TicketStatus, UserRole } from "@/types";
import {
  getTickets,
  createTicketInDB,
  updateTicketStatusInDB,
  updateTicketNoteInDB,
  updateTicketBudgetInDB,
  addTicketMessageInDB,
} from "./supabase-service";

export function useTicketStore() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      return (localStorage.getItem("chispa32_user_role") as UserRole) || "cliente";
    } catch {
      return "cliente";
    }
  });
  const [isLoaded, setIsLoaded] = useState(false);

  const refreshTickets = useCallback(async () => {
    try {
      const data = await getTickets();
      setTickets(data);
    } catch (e) {
      console.error("Error refreshing tickets:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      try {
        const data = await getTickets();
        if (!cancelled) {
          setTickets(data);
          setIsLoaded(true);
        }
      } catch (e) {
        if (!cancelled) {
          console.error("Error refreshing tickets:", e);
          setIsLoaded(true);
        }
      }
    }
    void loadData();
    return () => { cancelled = true; };
  }, []);

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    try {
      localStorage.setItem("chispa32_user_role", role);
    } catch (e) {
      console.error("Error guardando rol:", e);
    }
  };

  const createTicket = async (ticketData: Omit<Ticket, "id" | "ticket_number" | "created_at" | "updated_at">) => {
    const newTicket = await createTicketInDB(ticketData);
    setTickets((prev) => [newTicket, ...prev]);

    // Send Telegram Notification
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
    } catch {}

    return newTicket;
  };

  const updateTicketStatus = async (ticketId: string, newStatus: TicketStatus) => {
    await updateTicketStatusInDB(ticketId, newStatus);
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, estado: newStatus, updated_at: new Date().toISOString() } : t))
    );
  };

  const updateInternalNote = async (ticketId: string, note: string) => {
    await updateTicketNoteInDB(ticketId, note);
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, nota_interna: note, updated_at: new Date().toISOString() } : t))
    );
  };

  const updateBudget = async (ticketId: string, budget: number) => {
    await updateTicketBudgetInDB(ticketId, budget);
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, presupuesto: budget, updated_at: new Date().toISOString() } : t))
    );
  };

  const addMessage = async (
    ticketId: string,
    messageText: string,
    senderId: string,
    senderName: string,
    senderRole: UserRole
  ) => {
    const newMsg = await addTicketMessageInDB(ticketId, messageText, senderId, senderName, senderRole);
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, messages: [...(t.messages || []), newMsg] } : t))
    );

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
      } catch {}
    }

    return newMsg;
  };

  return {
    tickets,
    currentRole,
    isLoaded,
    switchRole,
    refreshTickets,
    createTicket,
    updateTicketStatus,
    updateInternalNote,
    updateBudget,
    addMessage,
  };
}
