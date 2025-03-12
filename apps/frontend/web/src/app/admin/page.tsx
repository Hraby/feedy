'use client';

import { usePathname } from 'next/navigation';
import AdminSidebar from "@/components/AdminSidebar";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { fetchDashboardData } from '../actions/adminAction';

export default function AdminDashboard() {
    const { user, accessToken } = useAuth();
    const pathname = usePathname();
    
    const [data, setData] = useState({
        activeOrders: 0,
        activeCouriers: 0,
        totalRestaurants: 0,
        totalUsers: 0
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!accessToken) return;

        async function loadDashboardData() {
            try {
                setLoading(true);
                const dashboardData = await fetchDashboardData(accessToken!);
                setData(dashboardData);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Unkown error'));
            } finally {
                setLoading(false);
            }
        }

        loadDashboardData();
    }, [accessToken]);

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar activePath={pathname} />

            <main className="flex-1 p-8">
                <h2 className="text-4xl font-bold mb-2">Dashboard</h2>
                <p className="text-gray-600 mb-8">Spravujte objednávky, restaurace i řidiče z jednoho místa.</p>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                        Nepodařilo se načíst data. Zkuste to prosím později.
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] p-6 rounded-2xl text-white">
                        <p>Celkový počet objednávek:</p>
                        <h3 className="text-4xl font-bold">{loading ? '...' : data.activeOrders}</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <p>Celkový počet uživatelů:</p>
                        <h3 className="text-4xl font-bold">{loading ? '...' : data.totalUsers}</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <p>Celkový počet kurýrů:</p>
                        <h3 className="text-4xl font-bold">{loading ? '...' : data.activeCouriers}</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <p>Celkový počet restaurací:</p>
                        <h3 className="text-4xl font-bold">{loading ? '...' : data.totalRestaurants}</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl col-span-2 shadow-sm">
                        <h3 className="text-xl font-semibold mb-4">Graf nově registrovaných uživatelů</h3>
                        <div className="h-40 bg-gray-100 rounded-lg"></div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl col-span-2 shadow-sm">
                        <h3 className="text-xl font-semibold mb-4">Finanční obrat feedy</h3>
                        <div className="h-40 bg-gray-100 rounded-lg"></div>
                    </div>
                </div>
            </main>
        </div>
    );
}