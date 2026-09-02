import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SUPER_ADMIN_EMAIL = "echevarriaexequiell@gmail.com";

// Evaúa el destino según el rol del usuario autenticado
function resolveDestination(requestedNext: string, userEmail: string | undefined) {
  const lower = userEmail?.trim().toLowerCase();
  // El super admin siempre va a su dashboard, pase lo que pase
  if (lower === SUPER_ADMIN_EMAIL.toLowerCase()) return "/admin";
  // Los demás usuarios van a comentarios (su única área autenticada)
  if (
    requestedNext &&
    requestedNext.startsWith("/admin")
  ) {
    return "/comentarios";
  }
  return requestedNext || "/comentarios";
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const destination = resolveDestination(next, user?.email);

        // Redirect cleanly
        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocalEnv = process.env.NODE_ENV === "development";
        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}${destination}`);
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${destination}`);
        } else {
          return NextResponse.redirect(`${origin}${destination}`);
        }
      }
    } catch (e) {
      console.error("Auth callback error:", e);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
