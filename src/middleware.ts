import { NextRequest, NextResponse } from "next/server";
import { generateSessionId, SESSION_COOKIE_NAME } from "@/domain/entity/Session/sessionCookie";

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|fonts|icons|public|api/search).*)",
    ],
};

export function middleware(request: NextRequest): NextResponse {
    const response = NextResponse.next({ request });
    const existingCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!existingCookie) {
        const sessionId = generateSessionId();
        response.cookies.set(SESSION_COOKIE_NAME, sessionId, {
            path: "/",
            maxAge: 31536000,
            sameSite: "lax",
            httpOnly: false,
        });
    }

    return response;
}