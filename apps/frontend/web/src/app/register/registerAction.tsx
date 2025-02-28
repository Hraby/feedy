"use server"

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSession } from "@/lib/session";

export default async function registerAction(currentState: any, formData: FormData): Promise<string> {

    const email = formData.get("email");
    const password = formData.get("password");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");

    const response = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({firstName, lastName, email, password}),
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