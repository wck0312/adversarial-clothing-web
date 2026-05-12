import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/cart", "/wish", "/my-page"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED.some((path) => pathname.startsWith(path));

  if (isProtected) {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cart/:path*", "/wish/:path*", "/my-page/:path*"],
};
