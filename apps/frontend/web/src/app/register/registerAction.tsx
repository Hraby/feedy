"use server"

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSession, updateTokens } from "@/lib/session";
import { BACKEND_URL } from "@/lib/constants";

export default async function registerAction(currentState: any, formData: FormData): Promise<string> {
    const email = formData.get("email");
    const password = formData.get("password");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");

    const response = await fetch(`${BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({firstName, lastName, email, password}),
    });

    const json = await response.json();
    console.log(json)

    if (response.ok) {
        await updateTokens({accessToken: json.accessToken,refreshToken: json.refreshToken})
        redirect("/")
    } else {
      return json.message;
    }
}