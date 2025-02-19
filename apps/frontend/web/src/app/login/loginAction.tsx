"use server"

import { redirect } from "next/navigation";
import { createSession } from "@/lib/session";

export default async function loginAction(currentState: any, formData: FormData): Promise<string> {

    const email = formData.get("email");
    const password = formData.get("password");

    const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({email, password}),
    });

    const json = await response.json();

    console.log(json)

    if (response.ok) {
        await createSession(json.token)
        redirect("/")
    } else {
      return json.message;
    }
}