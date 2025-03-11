"use server";

import { redirect } from "next/navigation";
import { BACKEND_URL } from "@/lib/constants";
import { getSession } from "@/lib/session";

export default async function courierFormAction(_: any, formData: FormData): Promise<string | undefined> {
    const session = await getSession();
    const data = {
        name: formData.get("restaurantName"),
        description: formData.get("restaurantDescription"),
        phone: formData.get("restaurantOwnerPhone"),
        address: {
            street: formData.get("restaurantAddress"),
            city: formData.get("restaurantCity"),
            country: "CZ",
            zipCode: "",
        },
    };

    const response = await fetch(`${BACKEND_URL}/courier/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.accessToken}`,
        },        
        credentials: "include",
        body: JSON.stringify(data),
    });

    const json = await response.json();

    console.log(json);

    if (response.ok) {
        redirect("/");
    } else {
        return json.message || "Chyba při odesílání formuláře.";
    }
}