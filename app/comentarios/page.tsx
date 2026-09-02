"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, MessageSquarePlus, CheckCircle2, Edit3, X, Cpu, ArrowLeft, Sparkles } from "lucide-react";
import { Review } from "@/types";
import { getReviews, saveReview, INITIAL_REVIEWS } from "@/lib/supabase-service";
import { useCurrentUser, signInWithGoogle } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

export default function ComentariosPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [chipService, setChipService] = useState<string>("ESP32-WROOM");
  const [comentario, setComentario] = useState<string>("");
  const [nombre, setNombre] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { user, email, nombre: currentUserName, avatarUrl, isLoading } = useCurrentUser();

  const loadReviews = async () => {
    try {
      const data = await getReviews();
      setReviews(data.filter((r) => r.aprobado));
    } catch {
      setReviews(INITIAL_REVIEWS.filter((r) => r.aprobado));
    }
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getReviews();
        if (!cancelled) setReviews(data.filter((r) => r.aprobado));
      } catch {
        if (!cancelled) setReviews(INITIAL_REVIEWS.filter((r) => r.aprobado));
      }
    }
    void load();
    return () => { cancelled = true; };
  }, []);

  const existingReview = user && reviews.length > 0
    ? reviews.find((r) => r.user_id === user.id || (email && r.user_email === email)) ?? null
    : null;
  const existingReviewId = existingReview?.id ?? null;

  const handleStartEditing = () => {
    if (existingReview) {
      setRating(existingReview.rating);
      setChipService(existingReview.chip_o_servicio || "ESP32");
      setComentario(existingReview.comentario);
      setNombre(existingReview.user_nombre || "");
    } else {
      setNombre(currentUserName || "");
    }
    setIsEditing(true);
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle("/comentarios");
    } catch (e) {
      console.error("Error signing in:", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    try {
      await saveReview({
        id: existingReviewId || undefined,
        user_id: user.id,
        user_email: email || "",
        user_nombre: nombre.trim() || currentUserName || "Cliente",
        user_avatar: avatarUrl || undefined,
        rating,
        chip_o_servicio: chipService,
        comentario: comentario.trim(),
        aprobado: true,
        destacado: rating === 5,
      });

      await loadReviews();

      setSuccessMsg(existingReviewId ? "¡Reseña actualizada con éxito!" : "¡Gracias! Tu opinión ya está en el banner del taller.");
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      console.error("Error saving review:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen font-sans">
      
      {/* ── Hero de la Página ── */}
      <section className="bg-[#191C21] text-white py-16 sm:py-24 px-4 relative overflow-hidden border-b-4 border-[#FF5500]">
        <div className="absolute inset-0 bg-dark-grid pointer-events-none opacity-60" />
        <div className="absolute top-0 left-1/3 w-[600px] h-[300px] bg-[#FF5500]/15 blur-[80px] pointer-events-none" />
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#2C3038] text-[#FF5500] rounded-full font-mono text-xs font-bold uppercase tracking-widest border border-[#3A404D] mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            EXPERIENCIAS VERIFICADAS EN TALLER
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tight leading-[1.0] text-white mb-4">
            Opiniones del
            <span className="block text-[#FF5500]">Taller Chispa32</span>
          </h1>
          
          <p className="text-base sm:text-xl text-[#A69E8F] max-w-2xl mx-auto font-sans leading-relaxed mb-8">
            Proyectos recuperados, flasheos exitosos y desarrollos IoT en Rosario. Leé lo que dicen nuestros clientes.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FF5500] hover:bg-[#E64D00] text-white font-mono font-bold rounded-xl uppercase tracking-wider text-sm transition-all shadow-lg hover:scale-[1.03] border border-[#D94800]"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a la Página Principal
          </Link>
        </div>
      </section>

      {/* ── Formulario de Comentario / Login ── */}
      <section className="py-16 sm:py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          
          {!user && !isLoading ? (
            /* ── NOT LOGGED IN ── */
            <div className="bg-[#FAF8F3] border-4 border-[#191C21] rounded-2xl p-10 sm:p-14 text-center shadow-2xl">
              <div className="w-20 h-20 bg-[#FF5500] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MessageSquarePlus className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-black uppercase text-[#191C21] mb-3">
                Dejá tu opinión
              </h2>
              <p className="text-sm text-[#595245] max-w-sm mx-auto leading-relaxed mb-8 font-sans">
                Para mantener la autenticidad de las reseñas de taller, iniciate sesión con tu cuenta Google.
              </p>

              <button
                onClick={handleGoogleLogin}
                className="w-full max-w-xs mx-auto py-4 px-6 bg-[#191C21] hover:bg-[#2C3038] text-white font-mono font-bold rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg text-sm uppercase tracking-wider hover:scale-[1.02]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Continuar con Google
              </button>
            </div>
          ) : user && !isEditing && existingReviewId ? (
            /* ── USER ALREADY HAS REVIEW ── */
            <div className="bg-[#FAF8F3] border-4 border-[#191C21] rounded-2xl p-10 sm:p-14 text-center shadow-2xl">
              <CheckCircle2 className="w-16 h-16 text-[#2E7D32] mx-auto mb-5" />
              <h2 className="text-3xl font-black uppercase text-[#191C21] mb-2">
                ¡Ya dejaste tu opinión!
              </h2>
              <p className="text-sm text-[#595245] mb-2 font-sans">
                Tu reseña ya está publicada en el banner del taller.
              </p>

              {/* Preview of their review */}
              <div className="bg-[#F3EFE6] border-2 border-[#D0C7B6] rounded-xl p-5 text-left mt-6 mb-6 font-sans">
                <div className="flex items-center gap-1 mb-2 text-[#FFB300]">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={`w-4 h-4 ${s <= rating ? "fill-[#FFB300]" : "text-[#D0C7B6]"}`} />
                  ))}
                </div>
                <p className="text-sm text-[#332E27] italic leading-relaxed">&ldquo;{comentario}&rdquo;</p>
                <p className="text-xs text-[#736B5E] mt-3 font-mono">{chipService}</p>
              </div>

              {successMsg && (
                <div className="mb-4 p-3 bg-[#E8F5E9] border-2 border-[#2E7D32] rounded-xl text-sm font-mono font-bold text-[#2E7D32]">
                  {successMsg}
                </div>
              )}

              <button
                onClick={handleStartEditing}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF5500] hover:bg-[#E64D00] text-white font-mono font-bold rounded-xl uppercase tracking-wider text-sm transition-all shadow-md"
              >
                <Edit3 className="w-4 h-4" />
                Editar mi reseña
              </button>

              <div className="mt-8 pt-6 border-t-2 border-[#EAE3D5]">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#191C21] hover:bg-[#2C3038] text-white font-mono font-bold rounded-xl uppercase tracking-wider text-sm transition-all shadow-lg"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver a la Página
                </Link>
              </div>
            </div>
          ) : user ? (
            /* ── COMMENT / EDIT FORM ── */
            <div className="bg-[#FAF8F3] border-4 border-[#191C21] rounded-2xl p-8 sm:p-12 shadow-2xl">
              
              {/* User badge */}
              <div className="flex items-center gap-3 mb-8 pb-6 border-b-2 border-[#EAE3D5]">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={nombre} className="w-12 h-12 rounded-full border-2 border-[#FF5500]" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#FF5500] text-white font-bold flex items-center justify-center text-lg">
                    {nombre.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-bold text-[#191C21] text-sm">{nombre || currentUserName}</p>
                  <p className="text-xs text-[#736B5E] font-mono">{email}</p>
                </div>
                {isEditing && existingReviewId && (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="ml-auto p-2 rounded-lg hover:bg-[#EAE3D5] text-[#736B5E] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#191C21] mb-2">
                {existingReviewId ? "Editar tu reseña" : "Compartí tu experiencia"}
              </h2>
              <p className="text-xs text-[#595245] font-mono mb-8">
                {existingReviewId ? "Actualizá tu opinión sobre el taller Chispa32." : "¿Cómo fue tu experiencia con el servicio técnico?"}
              </p>

              {successMsg && (
                <div className="mb-6 p-4 bg-[#E8F5E9] border-2 border-[#2E7D32] rounded-xl text-sm font-mono font-bold text-[#2E7D32] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Stars */}
                <div>
                  <label className="block text-xs font-black text-[#191C21] uppercase font-mono mb-3 tracking-wider">
                    Calificación del Servicio
                  </label>
                  <div className="flex items-center gap-3 bg-[#F3EFE6] p-5 rounded-xl border-2 border-[#D0C7B6]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setRating(s)}
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-125 focus:outline-none"
                      >
                        <Star className={`w-9 h-9 transition-colors ${s <= (hoverRating || rating) ? "fill-[#FF5500] text-[#FF5500]" : "text-[#D0C7B6]"}`} />
                      </button>
                    ))}
                    <span className="ml-auto font-mono text-sm font-black text-[#FF5500]">
                      {rating}/5 ★
                    </span>
                  </div>
                </div>

                {/* Nombre y Chip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-black text-[#191C21] uppercase font-mono mb-2 tracking-wider">
                      Tu nombre / firma
                    </label>
                    <input
                      type="text"
                      required
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ej: Marcos R."
                      className="w-full bg-[#F3EFE6] border-2 border-[#D0C7B6] rounded-xl px-4 py-3.5 text-sm text-[#191C21] focus:outline-none focus:border-[#FF5500] font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-[#191C21] uppercase font-mono mb-2 tracking-wider">
                      Placa / Trabajo realizado
                    </label>
                    <input
                      type="text"
                      required
                      value={chipService}
                      onChange={(e) => setChipService(e.target.value)}
                      placeholder="Ej: ESP32-S3 / Tasmota"
                      className="w-full bg-[#F3EFE6] border-2 border-[#D0C7B6] rounded-xl px-4 py-3.5 text-sm text-[#191C21] focus:outline-none focus:border-[#FF5500] font-sans"
                    />
                  </div>
                </div>

                {/* Comentario */}
                <div>
                  <label className="block text-xs font-black text-[#191C21] uppercase font-mono mb-2 tracking-wider">
                    Tu comentario / testimonio
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Contá qué problema tenía la placa, cómo fue el servicio en Rosario, cómo quedó funcionando tu proyecto..."
                    className="w-full bg-[#F3EFE6] border-2 border-[#D0C7B6] rounded-xl p-4 text-sm text-[#191C21] focus:outline-none focus:border-[#FF5500] placeholder:text-[#8C8474] font-sans leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-[#FF5500] hover:bg-[#E64D00] text-white font-mono font-black rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-lg text-base uppercase tracking-wider border-2 border-[#D94800]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Guardando reseña...
                    </span>
                  ) : (
                    <>
                      {existingReviewId ? <Edit3 className="w-5 h-5" /> : <MessageSquarePlus className="w-5 h-5" />}
                      {existingReviewId ? "Actualizar mi reseña" : "Publicar mi opinión en el banner"}
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t-2 border-[#EAE3D5] text-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#191C21] hover:bg-[#2C3038] text-white font-mono font-bold rounded-xl uppercase tracking-wider text-sm transition-all shadow-lg"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver a la Página Principal
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 rounded-full border-4 border-[#FF5500] border-t-transparent animate-spin" />
            </div>
          )}
        </div>
      </section>

      {/* ── Reviews Grid ── */}
      {reviews.length > 0 && (
        <section className="py-16 px-4 border-t-2 border-[#D6CEC0]">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black uppercase text-[#191C21] tracking-tight">
                Lo que dicen nuestros clientes
              </h2>
              <p className="text-sm text-[#595245] mt-2">
                {reviews.length} opiniones verificadas del taller
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-[#FAF8F3] border-2 border-[#D6CEC0] hover:border-[#FF5500] rounded-2xl p-6 shadow-sm transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {rev.user_avatar ? (
                          <img src={rev.user_avatar} alt={rev.user_nombre} className="w-10 h-10 rounded-full border-2 border-[#FF5500] object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#FF5500] text-white font-bold flex items-center justify-center">
                            {rev.user_nombre.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-1">
                            <p className="font-bold text-sm text-[#191C21]">{rev.user_nombre}</p>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#38D39F]" />
                          </div>
                          <p className="text-[11px] text-[#736B5E] font-mono">{formatDate(rev.created_at)}</p>
                        </div>
                      </div>
                      {rev.chip_o_servicio && (
                        <span className="text-[10px] font-mono font-bold bg-[#EAE3D5] text-[#191C21] px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <Cpu className="w-3 h-3 text-[#FF5500]" />
                          {rev.chip_o_servicio}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 mb-3 text-[#FFB300]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-4 h-4 ${s <= rev.rating ? "fill-[#FFB300]" : "text-[#D0C7B6]"}`} />
                      ))}
                    </div>

                    <p className="text-sm text-[#332E27] leading-relaxed italic font-sans">
                      &ldquo;{rev.comentario}&rdquo;
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#EAE3D5] flex items-center justify-between text-[10px] font-mono text-[#8C8474]">
                    <span>Taller Chispa32 • Rosario</span>
                    <span className="text-[#38D39F] font-bold">✓ Verificado</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
