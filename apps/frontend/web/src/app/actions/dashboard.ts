"use server";

import { BACKEND_URL } from "@/lib/constants";

export async function fetchDashboardStats() {
    try {
        const usersRes = await fetch(`${BACKEND_URL}/user`, { cache: "no-store" });
        const ordersRes = await fetch(`${BACKEND_URL}/order`, { cache: "no-store" });
        const restaurantsRes = await fetch(`${BACKEND_URL}/restaurant`, { cache: "no-store" });

        if (!usersRes.ok || !ordersRes.ok || !restaurantsRes.ok) {
            throw new Error("Chyba při načítání dat");
        }

        const users = await usersRes.json();
        const orders = await ordersRes.json();
        const restaurants = await restaurantsRes.json();

        return {
            totalUsers: users.length, 
            activeUsers: users.filter((user: any) => user.isActive).length, 
            totalOrders: orders.length, 
            activeOrders: orders.filter((order: any) => order.status !== "delivered" && order.status !== "cancelled").length,
            totalRestaurants: restaurants.length
        };
    } catch (error) {
        console.error("Chyba při získávání statistik:", error);
        return null;
    }
}