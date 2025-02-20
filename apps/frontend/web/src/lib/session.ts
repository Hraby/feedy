import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";

export type Session = {
    id: string;
    name: string;
    role: string;
}

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY!);

export async function createSession(session: string){
    const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    (await cookies()).set("session", session, {
        secure: true,
        httpOnly: true,
        expires: expiredAt,
        path: "/",
        sameSite: "strict",
    });
}

export async function getSession(){
    const cookie = (await cookies()).get("session")?.value;

    if(!cookie) return null;

    try {
        const session = cookie;
        
        const { payload } = await jwtVerify(session, SECRET_KEY, {algorithms: ["HS256"]});
        
        return payload as Session;
    } catch (error) {
        console.error("Invalid session:", error);
        redirect("/login")
    }
}

export async function deleteSession() {
    await (await cookies()).delete("session");
}

export async function getUser() {
    const session = await getSession();
    if (!session) return null;

    return session; 
}
