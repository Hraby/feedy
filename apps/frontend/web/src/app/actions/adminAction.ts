'use server';

import { BACKEND_URL } from '@/lib/constants';

interface DashboardData {
  activeOrders: number;
  activeCouriers: number;
  totalRestaurants: number;
  totalUsers: number;
}

export async function fetchDashboardData(accessToken: string): Promise<DashboardData> {
  if (!accessToken) {
    throw new Error("Access token not found");
  }

  try {
    const [ordersRes, couriersRes, restaurantsRes, usersRes] = await Promise.all([
      fetch(`${BACKEND_URL}order`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        credentials: "include",
      }),
      fetch(`${BACKEND_URL}courier`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        credentials: "include",
      }),
      fetch(`${BACKEND_URL}restaurant`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        credentials: "include",
      }),
      fetch(`${BACKEND_URL}user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        credentials: "include",
      })
    ]);

    if (!ordersRes.ok || !couriersRes.ok || !restaurantsRes.ok || !usersRes.ok) {
      throw new Error("Data fetch failed");
    }

    const [ordersData, couriersData, restaurantsData, usersData] = await Promise.all([
      ordersRes.json(),
      couriersRes.json(),
      restaurantsRes.json(),
      usersRes.json()
    ]);

    return {
      activeOrders: ordersData.length || 0,
      activeCouriers: couriersData.length || 0,
      totalRestaurants: restaurantsData.length || 0,
      totalUsers: usersData.length || 0
    };
  } catch (err) {
    console.error('Data fetch failed:', err);
    throw err instanceof Error ? err : new Error('Unkown error');
  }
}