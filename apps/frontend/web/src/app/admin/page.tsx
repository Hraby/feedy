'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminSidebar from "@/components/AdminSidebar";

export interface AdminSidebarProps {
    activePath: string;
}

const AdminDashboard = () => {
    const pathname = usePathname();
    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar activePath={pathname} />

            <main className="flex-1 p-8">
                <h2 className="text-4xl font-bold mb-2">Dashboard</h2>
                <p className="text-gray-600 mb-8">Spravujte objednávky, restaurace i řidiče z jednoho místa.</p>

                <div className="grid grid-cols-4 gap-6">
                    <div className="bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] p-6 rounded-2xl text-white">
                        <p>Počet aktivních objednávek:</p>
                        <h3 className="text-4xl font-bold">0</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <p>Počet aktivních kurýrů:</p>
                        <h3 className="text-4xl font-bold">0</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <p>Celkový počet restaurací:</p>
                        <h3 className="text-4xl font-bold">0</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <p>Celkový počet uživatelů:</p>
                        <h3 className="text-4xl font-bold">0</h3>
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
};

export default AdminDashboard;