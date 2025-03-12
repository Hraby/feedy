import Link from "next/link";
import { FaChartBar, FaUser, FaShoppingCart, FaUtensils, FaClipboardList, FaCog, FaHome, FaSignOutAlt } from 'react-icons/fa';
import { signOut } from "@/app/actions/auth";

interface ManagementSidebarProps {
    activePath: string;
}

export default function ManagementSidebar({ activePath }: ManagementSidebarProps) {
    const isActive = (path: string) => activePath === path ? 'text-[var(--gradient-purple-end)] font-semibold' : 'text-gray-600';

    const handleSignOut = async () => {
        await signOut();
    }

    return (
        <aside className="w-60 bg-white p-6 shadow-md rounded-xl h-full">
            <h1 className="text-xl font-bold text-white text-center bg-gradient-to-r from-[var(--gradient-purple-start)] to-[var(--gradient-purple-end)] p-4 rounded-3xl mb-8">feedy manage</h1>
            <nav>
                <h2 className="text-gray-400 uppercase text-sm mb-4">Menu</h2>
                <ul className="space-y-4">
                    <li className={`flex items-center ${isActive('/management')}`}>
                        <Link href="/management" className="flex items-center">
                            <FaChartBar className="mr-3" /> Dashboard
                        </Link>
                    </li>
                    <li className={`flex items-center ${isActive('/management/stats')}`}>
                        <FaClipboardList className="mr-3" /> Statistiky
                    </li>
                    <li className={`flex items-center ${isActive('/management/orders')}`}>
                        <Link href="/management/orders" className="flex items-center">
                            <FaShoppingCart className="mr-3" /> Objednávky
                        </Link>
                    </li>
                    <li className={`flex items-center ${isActive('/management/menu')}`}>
                        <Link href="/management/menu" className="flex items-center">
                            <FaUtensils className="mr-3" /> Menu
                        </Link>
                    </li>
                </ul>

                <h2 className="text-gray-400 uppercase text-sm mt-8 mb-4">Obecné</h2>
                <ul className="space-y-4">
                    <li className={`flex items-center ${isActive('/management/settings')}`}>
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
