"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquarePlus, Sparkles, CheckCircle2, Edit3, X, LogIn, Cpu, UserCheck } from "lucide-react";
import { Review } from "@/types";
import { getReviews, saveReview } from "@/lib/supabase-service";
import { useCurrentUser, signInWithGoogle } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

export function ReviewsMarquee() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [chipService, setChipService] = useState<string>("ESP32-S3 / Flasheo");
  const [comentario, setComentario] = useState<string>("");
  const [nombre, setNombre] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { user, email, nombre: currentUserName, avatarUrl, isLoading: isAuthLoading } = useCurrentUser();

  const loadReviews = async () => {
    try {
      const data = await getReviews();
      setReviews(data);
    } catch (e) {
      console.error("Error loading reviews:", e);
    }
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getReviews();
        if (!cancelled) setReviews(data);
      } catch (e) {
        if (!cancelled) console.error("Error loading reviews:", e);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, []);

  const existingReview = user && reviews.length > 0
    ? reviews.find((r) => r.user_id === user.id || (email && r.user_email === email)) ?? null
    : null;
  const existingReviewId = existingReview?.id ?? null;

  const handleOpenModal = () => {
    if (existingReview) {
      setRating(existingReview.rating);
      setChipService(existingReview.chip_o_servicio || "ESP32");
      setComentario(existingReview.comentario);
      setNombre(existingReview.user_nombre || currentUserName);
    } else {
      setNombre(currentUserName);
    }
    setIsModalOpen(true);
    setSuccessMsg(null);
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle("/");
    } catch (e) {
      console.error("Error signing in with Google:", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user && !email) return;

    setIsSubmitting(true);
    try {
      const reviewPayload = {
        id: existingReviewId || undefined,
        user_id: user?.id || `usr-${Date.now()}`,
        user_email: email || "usuario@google.com",
        user_nombre: nombre.trim() || currentUserName || "Cliente Taller",
        user_avatar: avatarUrl || undefined,
        rating: rating,
        chip_o_servicio: chipService,
        comentario: comentario.trim(),
        aprobado: true,
        destacado: rating === 5,
      };

      await saveReview(reviewPayload);
      await loadReviews();

      setSuccessMsg(existingReviewId ? "¡Tu opinión ha sido actualizada con éxito!" : "¡Gracias por compartir tu experiencia en el taller!");
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMsg(null);
      }, 1800);
    } catch (err) {
      console.error("Error saving review:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Duplicate reviews array for smooth infinite ticker
  const displayReviews = reviews.length > 0 ? [...reviews, ...reviews] : [];

  return (
    <section className="py-14 overflow-hidden text-[#191C21] relative">
      
      <div className="absolute top-0 left-1/4 w-96 h-32 bg-[#FF5500]/[0.04] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-32 bg-[#EAE3D5]/60 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl mb-8 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EAE3D5] text-[#FF5500] rounded font-mono text-xs font-bold uppercase tracking-wider border border-[#D0C7B6]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Experiencia en banco de trabajo</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#191C21] mt-2.5 tracking-tight">
              Lo que dicen clientes y desarrolladores
            </h2>
            <p className="text-xs sm:text-sm text-[#595245] mt-1 font-sans">
              Opiniones verificadas de proyectos recuperados, flasheos Tasmota y desarrollo IoT en Rosario.
            </p>
          </div>

          <button
            onClick={handleOpenModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#FF5500] hover:bg-[#E64D00] text-white font-mono font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md hover:scale-105 border border-[#D94800] shrink-0"
          >
            {existingReviewId ? <Edit3 className="w-4 h-4" /> : <MessageSquarePlus className="w-4 h-4" />}
            {existingReviewId ? "Editar mi opinión" : "Dejar opinión del taller"}
          </button>
        </div>
      </div>

      {/* Marquee Ticker Track (Moves Right to Left) */}
      <div className="relative w-full overflow-hidden py-3">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#FAF8F3] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#FAF8F3] to-transparent z-10" />

        {displayReviews.length === 0 ? (
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="border-2 border-dashed border-[#D6CEC0] rounded-2xl p-10 sm:p-12 text-center bg-[#FAF8F3]/80 backdrop-blur-sm">
              <div className="w-14 h-14 rounded-2xl bg-[#EAE3D5] border border-[#D0C7B6] flex items-center justify-center mx-auto mb-4">
                <MessageSquarePlus className="w-7 h-7 text-[#FF5500]" />
              </div>
              <h3 className="font-black text-lg text-[#191C21] mb-2">
                Todavía no hay reseñas publicadas
              </h3>
              <p className="text-sm text-[#595245] font-mono leading-relaxed max-w-md mx-auto mb-6">
                Si ya pasaste una placa por el banco, tu experiencia ayuda a otros ingenieros y técnicos a confiar en el taller.
              </p>
              <button
                onClick={handleOpenModal}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF5500] hover:bg-[#E64D00] text-white font-mono font-bold text-sm tracking-wide transition-all shadow-md border border-[#D94800]"
              >
                <Star className="w-4 h-4" />
                Sé el primero en dejar tu opinión
              </button>
            </div>
          </div>
        ) : (
        <div className="flex w-max gap-5 animate-marquee hover:[animation-play-state:paused] cursor-grab">
          {displayReviews.map((rev, index) => (
            <div
              key={`${rev.id}-${index}`}
              className="w-[320px] sm:w-[380px] bg-[#FAF8F3] hover:bg-white border-2 border-[#D6CEC0] hover:border-[#FF5500] rounded-xl p-5 transition-all flex flex-col justify-between shadow-sm hover:shadow-md shrink-0 group"
            >
              <div>
                {/* Header card */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    {rev.user_avatar ? (
                      <img
                        src={rev.user_avatar}
                        alt={rev.user_nombre}
                        className="w-9 h-9 rounded-full object-cover border border-[#FF5500]"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#FF5500] text-white font-bold flex items-center justify-center text-xs">
                        {rev.user_nombre.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs sm:text-sm text-[#191C21]">
                          {rev.user_nombre}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                      </div>
                      <span className="text-[10px] text-[#736B5E] font-mono">
                        {formatDate(rev.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Chip / Service badge */}
                  {rev.chip_o_servicio && (
                    <span className="text-[10px] font-mono font-bold bg-[#EAE3D5] text-[#E64A00] px-2 py-0.5 rounded border border-[#D0C7B6] flex items-center gap-1 shrink-0">
                      <Cpu className="w-3 h-3 text-[#FF5500]" />
                      {rev.chip_o_servicio}
                    </span>
                  )}
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-2.5 text-[#FF5500]">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${s <= rev.rating ? "fill-[#FF5500]" : "text-[#D0C7B6]"}`}
                    />
                  ))}
                </div>

                {/* Review comment */}
                <p className="text-xs sm:text-sm text-[#524B3E] leading-relaxed line-clamp-4 font-sans">
                  &ldquo;{rev.comentario}&rdquo;
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#EAE3D5] flex items-center justify-between text-[10px] font-mono text-[#736B5E]">
                <span>Taller Chispa32 • Rosario</span>
                <span className="text-[#2E7D32] font-bold">✓ Trabajo validado</span>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Review Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FAF8F3] text-[#191C21] border-4 border-[#191C21] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative font-sans">
            
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-[#EAE3D5] text-[#191C21] hover:bg-[#D0C7B6] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content for Not-Logged-in vs Logged-in */}
            {!user ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 bg-[#FF5500] text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
                  <UserCheck className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black uppercase text-[#191C21]">
                  Autenticate con Google
                </h3>
                <p className="text-xs sm:text-sm text-[#595245] max-w-sm mx-auto font-medium">
                  Para mantener la veracidad y calidad de las reseñas de taller, requerimos autenticarte con tu cuenta de Google.
                </p>

                <div className="pt-4">
                  <button
                    onClick={handleGoogleLogin}
                    className="w-full py-4 px-6 bg-[#191C21] hover:bg-[#2C3038] text-white font-mono font-bold rounded-xl flex items-center justify-center gap-3 transition-all shadow-md text-xs sm:text-sm uppercase tracking-wider border-2 border-[#191C21]"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continuar con Google</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold bg-[#FF5500] text-white px-2 py-0.5 rounded uppercase">
                      {existingReviewId ? "MODO EDICIÓN" : "NUEVA OPINIÓN"}
                    </span>
                    <span className="text-xs font-mono text-[#736B5E]">
                      Sesión: {email}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black uppercase text-[#191C21]">
                    {existingReviewId ? "Editar tu opinión del taller" : "¿Cómo fue tu experiencia en Chispa32?"}
                  </h3>
                </div>

                {successMsg && (
                  <div className="p-3 bg-[#E8F5E9] border-2 border-[#2E7D32] rounded-lg text-xs font-mono font-bold text-[#2E7D32] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {/* Rating Stars Selector */}
                <div>
                  <label className="block text-xs font-bold text-[#191C21] uppercase font-mono mb-1.5">
                    Calificación de Servicio
                  </label>
                  <div className="flex items-center gap-2 bg-[#F3EFE6] p-3 rounded-lg border-2 border-[#D0C7B6]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setRating(s)}
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-125 focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            s <= (hoverRating || rating)
                              ? "fill-[#FF5500] text-[#FF5500]"
                              : "text-[#D0C7B6]"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-auto font-mono text-xs font-bold text-[#FF5500]">
                      {rating} de 5 estrellas
                    </span>
                  </div>
                </div>

                {/* Nombre & Chip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#191C21] uppercase font-mono mb-1">
                      Tu Nombre / Firma
                    </label>
                    <input
                      type="text"
                      required
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ej: Marcos R."
                      className="w-full bg-[#F3EFE6] border-2 border-[#D0C7B6] rounded-lg px-3 py-2 text-xs text-[#191C21] focus:outline-none focus:border-[#FF5500]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#191C21] uppercase font-mono mb-1">
                      Placa / Trabajo Realizado
                    </label>
                    <input
                      type="text"
                      required
                      value={chipService}
                      onChange={(e) => setChipService(e.target.value)}
                      placeholder="Ej: ESP32-WROOM / Tasmota"
                      className="w-full bg-[#F3EFE6] border-2 border-[#D0C7B6] rounded-lg px-3 py-2 text-xs text-[#191C21] focus:outline-none focus:border-[#FF5500]"
                    />
                  </div>
                </div>

                {/* Comentario */}
                <div>
                  <label className="block text-xs font-bold text-[#191C21] uppercase font-mono mb-1">
                    Tu Comentario / Testimonio
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Contá qué problema tenía la placa, cómo te atendimos en Rosario o cómo quedó funcionando el proyecto..."
                    className="w-full bg-[#F3EFE6] border-2 border-[#D0C7B6] rounded-lg p-3 text-xs text-[#191C21] focus:outline-none focus:border-[#FF5500] placeholder:text-[#8C8474]"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#FF5500] hover:bg-[#E64D00] text-white font-mono font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-md uppercase tracking-wider text-xs sm:text-sm border border-[#D94800]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Guardando Reseña...
                    </span>
                  ) : (
                    <>
                      {existingReviewId ? <Edit3 className="w-4 h-4" /> : <MessageSquarePlus className="w-4 h-4" />}
                      {existingReviewId ? "Actualizar Mi Reseña" : "Publicar Mi Opinión en el Banner"}
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
}
