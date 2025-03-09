"use server";

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

export type Session = {
    user: {
        id: string;
        name: string;
        role: string;
    };
    accessToken: string;
    refreshToken: string;
};

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY!);

export async function createSession(payload: Session) {
    const expire = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 d

    const cookieStore = await cookies();

    const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);

    cookieStore.set("session", session, {
        httpOnly: true,
        secure: true,
        expires: expire,
        sameSite: "lax",
        path: "/",
    });
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}

export async function getSession() {
    const cookieStore = await cookies();
    let cookie = cookieStore.get("session")?.value;
    if (!cookie) return null;

    try {
        const { payload } = await jwtVerify(cookie, SECRET_KEY, { algorithms: ["HS256"] });
        return payload as Session;
    } catch (error) {
        console.log("Invalid session", error);
        return null;
    }
}

export async function updateTokens({accessToken, refreshToken}:{accessToken: string, refreshToken: string}){
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    if(!session) return null;

    const { payload } = await jwtVerify<Session>(session, SECRET_KEY, { algorithms: ["HS256"] });
    if(!payload) console.log("Invalid session");

    const newPayload: Session ={
        user: {
            ...payload.user,
        },
        accessToken,
        refreshToken,
    };

    await createSession(newPayload)

}

export async function getUser() {
    const session = await getSession();
    return session?.user;
}