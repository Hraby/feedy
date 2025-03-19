'use client';

import { usePathname } from 'next/navigation';
import AdminSidebar from "@/components/AdminSidebar";
import { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    TooltipItem,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function AdminDashboard() {
    const pathname = usePathname();

    const [data] = useState({
        activeOrders: 125,
        activeCouriers: 34,
        totalRestaurants: 18,
        totalUsers: 2350,
        newUsers: [
            { date: '01.03.', count: 10 },
            { date: '02.03.', count: 15 },
            { date: '03.03.', count: 8 },
            { date: '04.03.', count: 12 },
            { date: '05.03.', count: 20 }
        ],
        revenue: [
            { date: '01.03.', amount: 50000 },
            { date: '02.03.', amount: 72000 },
            { date: '03.03.', amount: 45000 },
            { date: '04.03.', amount: 61000 },
            { date: '05.03.', amount: 87000 }
        ],
    });

    const newUsersChartData = {
        labels: data.newUsers.map((entry) => entry.date),
        datasets: [
            {
                label: 'Noví uživatelé',
                data: data.newUsers.map((entry) => entry.count),
                borderColor: 'rgb(255, 85, 0)',
                backgroundColor: 'rgb(255, 85, 0, 0.5)',
                pointStyle: 'circle',
                fill: true,
                tension: 0.3,
            }
        ],
    };

    const revenueChartData = {
        labels: data.revenue.map((entry) => entry.date),
        datasets: [
            {
                label: 'Finanční obrat (Kč)',
                data: data.revenue.map((entry) => entry.amount),
                backgroundColor: 'rgb(255, 85, 0, 0.5)'
            }
        ]
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar activePath={pathname} />

            <main className="flex-1 p-8">
                <h2 className="text-4xl font-bold mb-2">Dashboard</h2>
                <p className="text-gray-600 mb-8">Spravujte objednávky, restaurace i řidiče z jednoho místa.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] p-6 rounded-2xl text-white">
                        <p>Celkový počet objednávek:</p>
                        <h3 className="text-4xl font-bold">{data.activeOrders}</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <p>Celkový počet uživatelů:</p>
                        <h3 className="text-4xl font-bold">{data.totalUsers}</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <p>Celkový počet kurýrů:</p>
                        <h3 className="text-4xl font-bold">{data.activeCouriers}</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <p>Celkový počet restaurací:</p>
                        <h3 className="text-4xl font-bold">{data.totalRestaurants}</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl col-span-2 shadow-sm w-full h-96 flex items-center">
                        <div className="w-full h-full">
                            <h3 className="text-xl font-semibold">Graf registrovaných uživatelů</h3>
                            <Line className="pb-3" data={newUsersChartData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl col-span-2 shadow-sm w-full h-96 flex items-center">
                        <div className="w-full h-full">
                            <h3 className="text-xl font-semibold mb-4">Finanční obrat Feedy</h3>
                            <Bar className="pb-6" data={revenueChartData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
