"use server";

import { redirect } from "next/navigation";
import { BACKEND_URL } from "@/lib/constants";
import { getSession } from "@/lib/session";

export default async function restaurantFormAction(_: any, formData: FormData): Promise<string | undefined> {
    console.log(formData.getAll("restaurantCategory"))
    const session = await getSession();
    const data = {
        name: formData.get("restaurantName"),
        description: formData.get("restaurantDescription"),
        phone: formData.get("restaurantOwnerPhone"),
        category: formData.getAll("restaurantCategory"),
        address: {
            street: formData.get("restaurantAddress"),
            city: formData.get("restaurantCity"),
            country: "Czechia",
            zipCode: "",
        },
    };

    const response = await fetch(`${BACKEND_URL}/restaurant/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.accessToken}`,
        },        
        credentials: "include",
        body: JSON.stringify(data),
    });

    const json = await response.json();

    if (response.ok) {
        redirect("/");
    } else {
        return json.message || "Chyba při odesílání formuláře.";
    }
}