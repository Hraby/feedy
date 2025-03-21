import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { fetchRestaurants } from "@/app/actions/adminAction";
import { useRouter, useSearchParams } from "next/navigation";
import { FaChartBar, FaUser, FaShoppingCart, FaUtensils, FaClipboardList, FaCog, FaHome, FaSignOutAlt, FaStar } from 'react-icons/fa';
import { signOut } from "@/app/actions/auth";

interface ManagementSidebarProps {
    activePath: string;
}

export default function ManagementSidebar({ activePath }: ManagementSidebarProps) {
    const { accessToken, user } = useAuth();
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const restaurantId = searchParams.get("restaurantId");

    const isActive = (path: string) => activePath === path ? 'text-[var(--gradient-purple-end)] font-semibold' : 'text-gray-600';

    useEffect(() => {
        async function fetchData() {
            if (!accessToken || !user) return;

            try {
                const allRestaurants = await fetchRestaurants(accessToken);
                const ownedRestaurants = allRestaurants.filter((r: any) => r.ownerId === user.id);
                
                setRestaurants(ownedRestaurants);

                if (!restaurantId && ownedRestaurants.length > 0) {
                    router.push(`/management?restaurantId=${ownedRestaurants[0].id}`);
                }
            } catch (error) {
                console.error("Chyba při načítání restaurací:", error);
            }
        }
        fetchData();
    }, [accessToken, user, restaurantId, router]);

    const handleRestaurantChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = event.target.value;
        router.push(`/management?restaurantId=${selectedId}`);
    };

    return (
        <aside className="w-60 bg-white p-6 shadow-md rounded-xl h-full">
            <h1 className="text-xl font-bold text-white text-center bg-gradient-to-r from-[var(--gradient-purple-start)] to-[var(--gradient-purple-end)] p-4 rounded-3xl mb-8">feedy manage</h1>

            <div className="mb-6">
                <label className="text-gray-400 uppercase text-sm mb-4">Vyberte restauraci</label>
                <select 
                    className="w-full p-2 border rounded-lg bg-gray-100 focus:outline-[var(--gradient-purple-end)]" 
                    value={restaurantId || ""}
                    onChange={handleRestaurantChange}
                >
                    {restaurants.map((restaurant) => (
                        <option key={restaurant.id} value={restaurant.id}>
                            {restaurant.name}
                        </option>
                    ))}
                </select>
            </div>

            <nav>
                <h2 className="text-gray-400 uppercase text-sm mb-4">Menu</h2>
                <ul className="space-y-4">
                    <li className={`flex items-center ${isActive('/management')}`}>
                        <Link href={`/management?restaurantId=${restaurantId}`} className="flex items-center">
                            <FaChartBar className="mr-3" /> Dashboard
                        </Link>
                    </li>
                    <li className={`flex items-center ${isActive('/management/stats')}`}>
                        <FaClipboardList className="mr-3" /> Statistiky
                    </li>
                    <li className={`flex items-center ${isActive('/management/orders')}`}>
                        <Link href={`/management/orders?restaurantId=${restaurantId}`} className="flex items-center">
                            <FaShoppingCart className="mr-3" /> Objednávky
                        </Link>
                    </li>
                    <li className={`flex items-center ${isActive('/management/menu')}`}>
                        <Link href={`/management/menu?restaurantId=${restaurantId}`} className="flex items-center">
                            <FaUtensils className="mr-3" /> Menu
                        </Link>
                    </li>
                    <li className={`flex items-center ${isActive('/management/reviews')}`}>
                        <Link href={`/management/reviews?restaurantId=${restaurantId}`} className="flex items-center">
                            <FaStar className="mr-3" /> Recenze
                        </Link>
                    </li>
                </ul>

                <h2 className="text-gray-400 uppercase text-sm mt-8 mb-4">Obecné</h2>
                <ul className="space-y-4">
                    <li className={`flex items-center ${isActive('/management/settings')}`}>
                        <Link href="/management/settings" className="flex items-center">
                            <FaCog className="mr-3" /> Nastavení
                        </Link>
                    </li>
                    <li className="flex items-center text-gray-600">
                        <Link href="/menu" className="flex items-center">
                            <FaHome className="mr-3" /> Hlavní stránka
                        </Link>
                    </li>
                    <li className="flex items-center text-red-600">
                        <p onClick={signOut} className="flex items-center cursor-pointer">
                            <FaSignOutAlt className="mr-3" /> Odhlásit se
                        </p>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}