"use server";

import { redirect } from "next/navigation";
import { BACKEND_URL } from "@/lib/constants";
import { getSession } from "@/lib/session";

const categoryImageMap: Record<string, string> = {
    "Burger": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Kuřecí": "https://images.unsplash.com/photo-1560717869-37296557a131?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Pizza": "https://images.unsplash.com/photo-1573821663912-569905455b1c?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Čína": "https://images.unsplash.com/photo-1577859623802-b5e3ca51f885?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Snídaně": "https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Sushi": "https://images.unsplash.com/photo-1590987337605-84f3ed4dc29f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Salát": "https://images.unsplash.com/photo-1520066391310-428f06ebd602?q=80&w=2950&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Sladké": "https://images.unsplash.com/photo-1570476922354-81227cdbb76c?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Slané": "https://images.unsplash.com/photo-1727819833553-4f9086894f86?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};


function selectImageForCategories(categories: string[]): string {
    for (const category of categories) {
        if (categoryImageMap[category]) {
            return categoryImageMap[category];
        }
    }
    return "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
}

export default async function restaurantFormAction(_: any, formData: FormData): Promise<string | undefined> {
    const categories = formData.getAll("restaurantCategory") as string[];
    const imageUrl = selectImageForCategories(categories);
    
    const session = await getSession();
    const data = {
        name: formData.get("restaurantName"),
        description: formData.get("restaurantDescription"),
        phone: formData.get("restaurantOwnerPhone"),
        category: formData.getAll("restaurantCategory"),
        imageUrl: imageUrl,
        address: {
            street: formData.get("restaurantAddress"),
            city: formData.get("restaurantCity"),
            country: "Czechia",
            zipCode: "",
        },
    };

    console.log(data)

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