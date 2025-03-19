'use client';

import { usePathname } from 'next/navigation';
import ManagementSidebar from '@/components/ManagementSidebar';
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

export interface ManagementSidebarProps {
    activePath: string;
}

const ManagementDashboard = () => {
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
                    label: 'Objednávky',
                    data: data.newUsers.map((entry) => entry.count),
                    borderColor: 'rgb(123, 44, 191)',
                    backgroundColor: 'rgb(123, 44, 191, 0.5)',
                    pointStyle: 'circle',
                    fill: true,
                    tension: 0.3,
                }
            ],
            plugins: {
                tooltip: {
                    position: 'nearest'
                }
            }
        };
    
        const revenueChartData = {
            labels: data.revenue.map((entry) => entry.date),
            datasets: [
                {
                    label: 'Finanční obrat (Kč)',
                    data: data.revenue.map((entry) => entry.amount),
                    backgroundColor: 'rgb(123, 44, 191, 0.5)'
                }
            ]
        };

    return (
        <div className="flex h-screen bg-gray-100">
            <ManagementSidebar activePath={pathname} />

            <main className="flex-1 p-8">
                <h2 className="text-4xl font-bold mb-2">Dashboard</h2>
                <p className="text-gray-600 mb-8">Spravujte váš podnik z jednoho místa.</p>

                <div className="grid grid-cols-4 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-gradient-to-r from-[var(--gradient-purple-start)] to-[var(--gradient-purple-end)] p-6 rounded-2xl text-white">
                        <p>Počet aktuálních objednávek:</p>
                        <h3 className="text-4xl font-bold">0</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <p>Celkový počet objednávek:</p>
                        <h3 className="text-4xl font-bold">0</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm col-span-2">
                        <p>Nejoblíbenější produkt:</p>
                        <h3 className="text-4xl font-bold">Döner klasický</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl col-span-2 shadow-sm w-full h-96 flex items-center">
                        <div className="w-full h-full">
                            <h3 className="text-xl font-semibold">Graf objednávek</h3>
                            <Line className="pb-3" data={newUsersChartData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl col-span-2 shadow-sm w-full h-96 flex items-center">
                        <div className="w-full h-full">
                            <h3 className="text-xl font-semibold mb-4">Finanční obrat</h3>
                            <Bar className="pb-6" data={revenueChartData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ManagementDashboard;