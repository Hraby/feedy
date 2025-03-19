'use server';

import { BACKEND_URL } from '@/lib/constants';
import { AddressPayload } from '@/lib/session';

interface DashboardData {
    activeOrders: number;
    activeCouriers: number;
    totalRestaurants: number;
    totalUsers: number;
}

export interface User {
    id: string;
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

    const response = await fetch(`${BACKEND_URL}/order`, {
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

    return await response.json();
}

export async function fetchCouriers(accessToken: string){
    if (!accessToken) {
        throw new Error("Access token not found");
    }

    const response = await fetch(`${BACKEND_URL}/courier`, {
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

    return await response.json();
}

export async function fetchRestaurants(accessToken: string) {
    if (!accessToken) {
        throw new Error("Access token not found");
    }

    const response = await fetch(`${BACKEND_URL}/restaurant`, {
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

    return await response.json();
}

export async function fetchRestaurantId(id: string, accessToken: string){
    const response = await fetch(`${BACKEND_URL}/restaurant/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Restaurant fetch failed");
    }

    return await response.json();
}

export async function getMenu(accessToken: string, restaurantId: string){
    if (!accessToken) {
        throw new Error("Access token not found");
    }

    const response = await fetch(`${BACKEND_URL}/restaurant/${restaurantId}/menu`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        credentials: "include",
    });
  
    if (!response.ok) {
        throw new Error("Menu item get failed");
    }

    const data = await response.json();

    return data.menuItems.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        imageUrl: item.imageUrl,
        available: item.available,
    }));
}

export async function createMenuItem(accessToken: string, restaurantId: string, menuItemId: string, data: any){
    if (!accessToken) {
        throw new Error("Access token not found");
    }

    const newData = {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        available: data.available,
        imageUrl: data.imageUrl,
    }

    const response = await fetch(`${BACKEND_URL}/restaurant/${restaurantId}/menu`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify(newData),
    });
  
    if (!response.ok) {
        throw new Error("Menu item create failed");
    }

    return await response.json();
}

export async function updateMenuItem(accessToken: string, restaurantId: string, menuItemId: string, data: any){
    if (!accessToken) {
        throw new Error("Access token not found");
    }

    const newData = {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        available: data.available,
        imageUrl: data.imageUrl,
    }

    const response = await fetch(`${BACKEND_URL}/restaurant/${restaurantId}/menu/${menuItemId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify(newData),
    });
  
    if (!response.ok) {
        throw new Error("Menu item update failed");
    }

    return await response.json();
}

export async function deleteMenuItem(accessToken: string, restaurantId: string, menuItemId: string, data: any){
    if (!accessToken) {
        throw new Error("Access token not found");
    }

    const response = await fetch(`${BACKEND_URL}/restaurant/${restaurantId}/menu/${menuItemId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        credentials: "include",
    });
  
    if (!response.ok) {
        throw new Error("Menu item delete failed");
    }

    return await response.json();
}

export async function fetchApprovedRestaurants(address: AddressPayload, accessToken: string) {
    const response = await fetch(`${BACKEND_URL}/restaurant`, {
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

    const restaurants = await response.json();

    return await restaurants.filter(
        (restaurant: any) => 
            restaurant.status === "Approved" && 
            restaurant.address?.city === address.city
    );

}

export async function fetchUsers(accessToken: string) {
    if (!accessToken) {
        throw new Error("Access token not found");
    }

    const response = await fetch(`${BACKEND_URL}/user`, {
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

    return await response.json();
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
        console.log("Data fetch failed:", err);
        throw err instanceof Error ? err : new Error("Unknown error");
    }
}

export async function updateUser(userId: string, userData: UserUpdateData, accessToken: string): Promise<User> {
    if (!accessToken) {
        throw new Error("Access token not found");
    }

    console.log(userData)
  
    const response = await fetch(`${BACKEND_URL}/user/${userId}`, {
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
  
    return await response.json();
}

export async function deleteUser(userId: string, accessToken: string): Promise<User> {
    if (!accessToken) {
        throw new Error("Access token not found");
    }
  
    const response = await fetch(`${BACKEND_URL}/user/${userId}`, {
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
  
    return await response.json();
}

export async function deleteRestaurant(restaurantId: string, accessToken: string){
    if(!accessToken){
        throw new Error("Access token not found");
    }

    const response = await fetch(`${BACKEND_URL}/restaurant/${restaurantId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        credentials: "include",
    });
  
    if (!response.ok) {
        throw new Error("Restaurant delete failed");
    }
  
    return await response.json();
}

export async function updateRestaurantStatus(restaurantId: string, accessToken: string, status: string){
    if(!accessToken){
        throw new Error("Access token not found");
    }

    const response = await fetch(`${BACKEND_URL}/restaurant/${restaurantId}/approve`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({status: status}),
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Restaurant update status failed");
    }
  
    return await response.json();
}

export async function updateCourierStatus(courierId: string, accessToken:string, status: string){
    if(!accessToken){
        throw new Error("Access token not found");
    }

    const response = await fetch(`${BACKEND_URL}/courier/${courierId}/approve`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({status: status}),
        credentials: "include",
    });
    
    if (!response.ok) {
        throw new Error("Restaurant update status failed");
    }
  
    return await response.json();
}

export async function updateUserRole(userId: string, role: string[], accessToken: string): Promise<User> {
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

export async function getOrdersRestaurant(accessToken: string, restaurantId: string){
    if (!accessToken) {
        throw new Error("Access token not found");
    }

    const response = await fetch(`${BACKEND_URL}/restaurant/${restaurantId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        credentials: "include",
    }); 
  
    if (!response.ok) {
        throw new Error("Get orders failed");
    }

    const data = await response.json();

    return data.orders.map((order: any) => {
        const items = order.orderItems.map((item: any) => item.menuItem.name);
        
        const orderDate = new Date(order.createdAt);
        const formattedDate = orderDate.toISOString().split('T')[0];
        const formattedTime = orderDate.toTimeString().split(' ')[0];
        
        const restaurantName = "Restaurant Name";
        
        return {
          id: order.id,
          items: items,
          status: order.status,
          orderDate: formattedDate,
          orderTime: formattedTime,
          restaurantName: restaurantName,
          courier: order.courierProfileId,
          new: true
        };
    });
}

export async function approveOrder(accessToken: string, orderId: string){
    if (!accessToken) {
        throw new Error("Access token not found");
    }

    const response = await fetch(`${BACKEND_URL}/order/${orderId}/prepare`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({status: "Preparing"})
    });

    if (!response.ok) {
        throw new Error("Order approve failed");
    }
    return await response.json();
}

export async function markOrderReady(accessToken: string, orderId: string){
    if (!accessToken) {
        throw new Error("Access token not found");
    }

    const response = await fetch(`${BACKEND_URL}/order/${orderId}/ready`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({status: "Ready"})
    });
  
    if (!response.ok) {
        throw new Error("Order ready failed");
    }

    return await response.json();
}