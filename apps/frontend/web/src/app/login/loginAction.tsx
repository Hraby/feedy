"use server"

import { redirect } from "next/navigation";
import { createSession } from "@/lib/session";
import { BACKEND_URL } from "@/lib/constants";

export default async function loginAction(currentState: any, formData: FormData): Promise<string> {

    const email = formData.get("email");
    const password = formData.get("password");

    const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({email, password}),
    });

    const json = await response.json();

    if (response.ok) {
        const payload = {
            user: {
                id: json.user.id,
                name: json.user.firstName+" "+json.user.lastName,
                role: json.user.role,
                email: email as string,
            },
            accessToken: json.accessToken,
            refreshToken: json.refreshToken,
        }
        await createSession(payload)
        redirect("/")
    } else {
      return json.message;
    }
}