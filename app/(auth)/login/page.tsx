"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Wrench, AlertCircle } from "lucide-react";
import { signInWithGoogle } from "@/lib/auth";

function LoginForm() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    errorParam === "auth_failed" ? "No se pudo completar la autenticación. Probá nuevamente." : null
  );

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorMessage(null);
    try {
      // All users go to /comentarios after Google login
      await signInWithGoogle("/comentarios");
    } catch (err: any) {
      setErrorMessage(err?.message || "Error al conectar con Google");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 font-sans">
      <div className="w-full max-w-sm bg-[#FAF8F3]/90 backdrop-blur-md border-4 border-[#191C21] p-10 rounded-2xl shadow-xl relative text-center">
        
        {/* Header */}
        <div className="mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#FF5500] flex items-center justify-center text-white mx-auto mb-4 shadow-md border-2 border-[#191C21]">
            <Wrench className="w-8 h-8 -rotate-45" />
          </div>
          <h1 className="text-2xl font-black text-[#191C21] tracking-tight">
            Ingresar con Google
          </h1>
          <p className="text-xs text-[#595245] mt-2 font-medium font-mono leading-relaxed">
            Para dejar tu opinión sobre el taller necesitás autenticarte con tu cuenta de Google.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3 bg-[#FFEBEE] border-2 border-[#C62828] rounded-lg text-xs text-[#C62828] font-mono flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Google Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full py-4 px-4 bg-[#191C21] hover:bg-[#2C3038] text-white font-mono font-bold rounded-xl flex items-center justify-center gap-3 transition-all shadow-md text-sm tracking-wide border-2 border-[#191C21] hover:scale-[1.02]"
        >
          {googleLoading ? (
            <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
          )}
          <span>Continuar con Google</span>
        </button>

        <div className="mt-6 pt-5 border-t-2 border-[#EAE3D5]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#736B5E] hover:text-[#FF5500] transition-colors"
          >
            ← Volver a la página principal
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-[#595245] font-mono">Cargando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
