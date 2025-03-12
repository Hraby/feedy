'use server';

import { BACKEND_URL } from '@/lib/constants';

interface DashboardData {
    activeOrders: number;
    activeCouriers: number;
    totalRestaurants: number;
    totalUsers: number;
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    role: string[];
    createdAt: string;
    updatedAt: string;
}

interface UserUpdateData {
    firstName?: string;
    lastName?: string;
    role: string[];
}

export async function fetchOrders(accessToken: string) {
    if (!accessToken) {
        throw new Error("Access token not found");
    }

    const response = await fetch(`${BACKEND_URL}order`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Orders fetch failed");
    }

    return response.json();
}

export async function fetchCouriers(accessToken: string){
    if (!accessToken) {
        throw new Error("Access token not found");
    }

    const response = await fetch(`${BACKEND_URL}courier`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Couriers fetch failed");
    }

    return response.json();
}

export async function fetchRestaurants(accessToken: string) {
    if (!accessToken) {
        throw new Error("Access token not found");
    }

    const response = await fetch(`${BACKEND_URL}restaurant`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Restaurants fetch failed");
    }

    return response.json();
}

export async function fetchUsers(accessToken: string) {
    if (!accessToken) {
        throw new Error("Access token not found");
    }

    const response = await fetch(`${BACKEND_URL}user`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Users fetch failed");
    }

    return response.json();
}

export async function fetchDashboardData(accessToken: string): Promise<DashboardData> {
    if (!accessToken) {
        throw new Error("Access token not found");
    }

    try {
        const [ordersData, couriersData, restaurantsData, usersData] = await Promise.all([
            fetchOrders(accessToken),
            fetchCouriers(accessToken),
            fetchRestaurants(accessToken),
            fetchUsers(accessToken)
        ]);

        return {
            activeOrders: ordersData.length || 0,
            activeCouriers: couriersData.length || 0,
            totalRestaurants: restaurantsData.length || 0,
            totalUsers: usersData.length || 0
        };
    } catch (err) {
        console.error("Data fetch failed:", err);
        throw err instanceof Error ? err : new Error("Unknown error");
    }
}

export async function updateUser(userId: number, userData: UserUpdateData, accessToken: string): Promise<User> {
    if (!accessToken) {
        throw new Error("Access token not found");
    }
  
    const response = await fetch(`${BACKEND_URL}user/${userId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify(userData),
    });
  
    if (!response.ok) {
        throw new Error("User update failed");
    }
  
    return response.json();
}

export async function deleteUser(userId: number, accessToken: string): Promise<User> {
    if (!accessToken) {
        throw new Error("Access token not found");
    }
  
    const response = await fetch(`${BACKEND_URL}user/${userId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        credentials: "include",
    });
  
    if (!response.ok) {
        throw new Error("User delete failed");
    }
  
    return response.json();
}

export async function updateUserRole(userId: number, role: string[], accessToken: string): Promise<User> {
    return updateUser(userId, {role}, accessToken);
}

export async function searchUsers(query: string, accessToken: string): Promise<User[]> {
    const users = await fetchUsers(accessToken);
    
    if (!query.trim()) {
        return users;
    }
    
    const searchLower = query.toLowerCase();
    return users.filter((user: User) => 
        user.firstName.toLowerCase().includes(searchLower) || 
        user.lastName.toLowerCase().includes(searchLower)
    );
}