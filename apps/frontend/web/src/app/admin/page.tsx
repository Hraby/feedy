'use client';

import { usePathname } from 'next/navigation';
import AdminSidebar from "@/components/AdminSidebar";
import { useState, useEffect } from 'react';
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
    Legend,
    ChartOptions
} from 'chart.js';
import { useAuth } from '@/contexts/AuthProvider';
import { fetchDashboardData, fetchOrders, fetchUsers } from '../actions/adminAction';

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
    const { accessToken } = useAuth();
    
    const [dashboardData, setDashboardData] = useState({
        activeOrders: 0,
        activeCouriers: 0,
        totalRestaurants: 0,
        totalUsers: 0
    });
    
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const processUsersByDate = (userData: any) => {
        if (!userData.length) return [];
        
        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        
        const days: { [key: string]: number } = {};
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const formattedDate = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.`;
            days[formattedDate] = 0;
        }
        
        userData.forEach((user: any) => {
            const createdAt = new Date(user.createdAt);
            if (createdAt >= lastWeek) {
                const formattedDate = `${String(createdAt.getDate()).padStart(2, '0')}.${String(createdAt.getMonth() + 1).padStart(2, '0')}.`;
                if (days[formattedDate] !== undefined) {
                    days[formattedDate]++;
                }
            }
        });
        
        return Object.entries(days)
            .map(([date, count]) => ({ date, count }))
            .reverse();
    };
    
    const calculateRevenue = (ordersData: any) => {
        if (!ordersData.length) return [];
        
        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        
        const days: { [key: string]: number } = {};
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const formattedDate = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.`;
            days[formattedDate] = 0;
        }
        
        ordersData.forEach((order: any) => {
            const createdAt = new Date(order.createdAt);
            if (createdAt >= lastWeek) {
                const formattedDate = `${String(createdAt.getDate()).padStart(2, '0')}.${String(createdAt.getMonth() + 1).padStart(2, '0')}.`;
                if (days[formattedDate] !== undefined) {
                    const orderTotal = order.orderItems?.reduce((sum: any, item: any) => {
                        return sum + (item.price * item.quantity);
                    }, 0) || 0;
                    days[formattedDate] += orderTotal;
                }
            }
        });
        
        return Object.entries(days)
            .map(([date, amount]) => ({ date, amount }))
            .reverse();
    };

    useEffect(() => {
        const loadData = async () => {
            if (!accessToken) {
                return;
            }
            
            setLoading(true);
            try {
                const [dashboard, usersData, ordersData] = await Promise.all([
                    fetchDashboardData(accessToken),
                    fetchUsers(accessToken),
                    fetchOrders(accessToken)
                ]);
                
                setDashboardData(dashboard);
                setUsers(usersData);
                setOrders(ordersData);
            } catch (err: any) {
                console.log(err);
                setError(err.message || "Nastala chyba při načítání dat");
            } finally {
                setLoading(false);
            }
        };
        
        loadData();
    }, [accessToken]);

    const newUsersData = processUsersByDate(users);
    const revenueData = calculateRevenue(orders);
    
    const newUsersChartData = {
        labels: newUsersData.map(entry => entry.date),
        datasets: [
            {
                label: 'Noví uživatelé',
                data: newUsersData.map(entry => entry.count),
                borderColor: 'rgb(255, 85, 0)',
                backgroundColor: 'rgb(255, 85, 0, 0.5)',
                pointStyle: 'circle',
                fill: true,
                tension: 0.3,
            }
        ],
    };

    const newUsersChartOptions: ChartOptions<"line"> = {
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
            },
        },
    };

    const revenueChartData = {
        labels: revenueData.map(entry => entry.date),
        datasets: [
            {
                label: 'Finanční obrat (Kč)',
                data: revenueData.map(entry => entry.amount),
                backgroundColor: 'rgb(255, 85, 0, 0.5)'
            }
        ]
    };

    const revenueChartOptions: ChartOptions<"bar"> = {
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
            },
        },
    };

    const StatCardSkeleton = () => (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-8 w-1/3 bg-gray-300 rounded animate-pulse"></div>
        </div>
    );

    const ChartSkeleton = () => (
        <div className="bg-white p-6 rounded-2xl col-span-2 shadow-sm w-full h-96 flex flex-col">
            <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="flex-1 bg-gray-100 rounded animate-pulse"></div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-100">
                <AdminSidebar activePath={pathname} />
                <main className="flex-1 p-8">
                    <div className="h-10 w-1/4 bg-gray-300 rounded animate-pulse mb-2"></div>
                    <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse mb-8"></div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-r from-orange-300 to-orange-200 p-6 rounded-2xl animate-pulse">
                            <div className="h-4 w-2/3 bg-white bg-opacity-30 rounded mb-4"></div>
                            <div className="h-8 w-1/3 bg-white bg-opacity-40 rounded"></div>
                        </div>

                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />

                        <ChartSkeleton />
                        <ChartSkeleton />
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen bg-gray-100">
                <AdminSidebar activePath={pathname} />
                <main className="flex-1 p-8">
                    <h2 className="text-4xl font-bold mb-2">Dashboard</h2>
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8" role="alert">
                        <p className="font-bold">Chyba</p>
                        <p>{error}</p>
                    </div>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        Zkusit znovu
                    </button>
                </main>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar activePath={pathname} />

            <main className="flex-1 p-8">
                <h2 className="text-4xl font-bold mb-2">Dashboard</h2>
                <p className="text-gray-600 mb-8">Spravujte objednávky, restaurace i řidiče z jednoho místa.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] p-6 rounded-2xl text-white">
                        <p>Celkový počet objednávek:</p>
                        <h3 className="text-4xl font-bold">{dashboardData.activeOrders}</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <p>Celkový počet uživatelů:</p>
                        <h3 className="text-4xl font-bold">{dashboardData.totalUsers}</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <p>Celkový počet kurýrů:</p>
                        <h3 className="text-4xl font-bold">{dashboardData.activeCouriers}</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <p>Celkový počet restaurací:</p>
                        <h3 className="text-4xl font-bold">{dashboardData.totalRestaurants}</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl col-span-2 shadow-sm w-full h-96 flex items-center">
                        <div className="w-full h-full">
                            <h3 className="text-xl font-semibold">Graf registrovaných uživatelů</h3>
                            <Line className="pb-3" data={newUsersChartData} options={newUsersChartOptions} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl col-span-2 shadow-sm w-full h-96 flex items-center">
                        <div className="w-full h-full">
                            <h3 className="text-xl font-semibold mb-4">Finanční obrat Feedy</h3>
                            <Bar className="pb-6" data={revenueChartData} options={revenueChartOptions} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}