'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ManagementSidebar from '@/components/ManagementSidebar';

export interface ManagementSidebarProps {
    activePath: string;
}

const ManagementDashboard = () => {
    const pathname = usePathname();
    return (
        <div className="flex h-screen bg-gray-100">
            <ManagementSidebar activePath={pathname} />

            <main className="flex-1 p-8">
                <h2 className="text-4xl font-bold mb-2">Dashboard</h2>
                <p className="text-gray-600 mb-8">Spravujte váš podnik z jednoho místa.</p>

                <div className="grid grid-cols-4 gap-6">
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

                    <div className="bg-white p-6 rounded-2xl col-span-2 shadow-sm">
                        <h3 className="text-xl font-semibold mb-4">Seznam nových objednávek</h3>
                        <div className="h-40 bg-gray-100 rounded-lg"></div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl col-span-2 shadow-sm">
                        <h3 className="text-xl font-semibold mb-4">Finanční obrat</h3>
                        <div className="h-40 bg-gray-100 rounded-lg"></div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ManagementDashboard;