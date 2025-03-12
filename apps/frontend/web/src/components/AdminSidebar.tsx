import Link from "next/link";
import { FaChartBar, FaUser, FaShoppingCart, FaUtensils, FaClipboardList, FaCog, FaHome, FaSignOutAlt } from 'react-icons/fa';
import { signOut } from "@/app/actions/auth";

interface AdminSidebarProps {
    activePath: string;
}

export default function AdminSidebar({ activePath }: AdminSidebarProps) {
    const isActive = (path: string) => activePath === path ? 'text-[var(--primary)] font-semibold' : 'text-gray-600';

    const handleSignOut = async () => {
        await signOut();
    }

    return (
        <aside className="w-60 bg-white p-6 shadow-md rounded-xl h-full">
            <h1 className="text-xl font-bold text-white text-center bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] p-4 rounded-3xl mb-8">feedy admin</h1>
            <nav>
                <h2 className="text-gray-400 uppercase text-sm mb-4">Menu</h2>
                <ul className="space-y-4">
                    <li className={`flex items-center ${isActive('/admin')}`}>
                        <Link href="/admin" className="flex items-center">
                            <FaChartBar className="mr-3" /> Dashboard
                        </Link>
                    </li>
                    <li className={`flex items-center ${isActive('/admin/stats')}`}>
                        <FaClipboardList className="mr-3" /> Statistiky
                    </li>
                    <li className={`flex items-center ${isActive('/admin/users')}`}>
                        <Link href="/admin/users" className="flex items-center">
                            <FaUser className="mr-3" /> Správa uživatelů
                        </Link>
                    </li>
                    <li className={`flex items-center ${isActive('/admin/orders')}`}>
                        <Link href="/admin/orders" className="flex items-center">
                            <FaShoppingCart className="mr-3" /> Správa objednávek
                        </Link>
                    </li>
                    <li className={`flex items-center ${isActive('/admin/restaurants')}`}>
                        <Link href="/admin/restaurants" className="flex items-center">
                            <FaUtensils className="mr-3" /> Správa restaurací
                        </Link>
                    </li>
                    <li className={`flex items-center ${isActive('/admin/requests')}`}>
                        <Link href="/admin/requests" className="flex items-center">
                            <FaClipboardList className="mr-3" /> Žádosti
                        </Link>
                    </li>
                </ul>

                <h2 className="text-gray-400 uppercase text-sm mt-8 mb-4">Obecné</h2>
                <ul className="space-y-4">
                    <li className={`flex items-center ${isActive('/admin/settings')}`}>
                        <FaCog className="mr-3" /> Nastavení
                    </li>
                    <li className="flex items-center text-gray-600">
                        <Link href="/menu" className="flex items-center">
                            <FaHome className="mr-3" /> Hlavní stránka
                        </Link>
                    </li>
                    <li className="flex items-center text-red-600">
                        <p onClick={handleSignOut} className="flex items-center cursor-pointer">
                            <FaSignOutAlt className="mr-3" /> Odhlásit se
                        </p>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}
