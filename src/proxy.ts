import { NextRequest, NextResponse } from "next/server";
import { createProxyClient } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  const { supabase, response } = createProxyClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not logged in → redirect to login
  if (!user) {
    const loginUrl = new URL("/minha-conta", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Logged in but not admin → redirect to home
  const role = user.app_metadata?.role;
  if (role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Admin → allow access
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
