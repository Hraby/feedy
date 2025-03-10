import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { BACKEND_URL } from "@/lib/constants";
import { getSession, updateTokens, deleteSession } from "@/lib/session";
import { jwtVerify } from "jose";

export async function GET() {
    const session = await getSession();
    console.log("Session refresh token:", session);

    if (!session) {
        return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    try {
          const response = await fetch(`${BACKEND_URL}/auth/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.refreshToken}`,
            },
            credentials: "include",
        });
    
        if (!response.ok) {
            await deleteSession();
            return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
        }

        const json = await response.json();
        await updateTokens(json.accessToken, json.refreshToken);

        return NextResponse.json({ accessToken: json.accessToken });
    } catch (error) {
        console.error("Token refresh error:", error);
        await deleteSession();
        return NextResponse.json({ error: "Failed to refresh token" }, { status: 500 });
    }
}