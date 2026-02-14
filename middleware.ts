import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { updateSession } from "./lib/supabase/middleware";

export async function middleware(request: NextRequest) {
    
const { response, user } = await updateSession(request);

  const pathname = request.nextUrl.pathname;

  // Protéger les routes dashboard et sous-routes
  if (pathname.startsWith("/dashboard") && !user) {
    const redirectUrl = new URL("/sign-in", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Si connecté → rediriger loin des pages auth
  if ((pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (user && pathname === "/") {
    // Redirige vers dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};