"use server"

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

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

    if (response.ok) {
        (await cookies()).set("access_token", json.token, {
          secure: true,
          httpOnly: true,
          expires: Date.now() + 24 * 60 * 60 * 1000,
          path: "/",
          sameSite: "strict",
        });
        redirect("/")
    } else {
      return json.message;
    }
}