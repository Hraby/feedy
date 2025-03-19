'use client';
import NavbarSwitcher from "@/components/NavbarSwitch";
import { useAuth } from "@/contexts/AuthProvider";
import { useParams } from "next/navigation";
import { useState } from "react";
import Modal from "@/components/Modal";
import Link from "next/link";
import CourierForm from "@/components/CourierForm";
import RestaurantForm from "@/components/RestaurantForm";
import { FaMapMarkerAlt, FaListAlt, FaWallet, FaInfoCircle, FaTruck, FaStore, FaCog, FaHome, FaBuilding, FaTrash, FaCalendar, FaClock } from 'react-icons/fa';
import AdminRestaurants from "@/app/admin/restaurants/page";
import { BACKEND_URL } from "@/lib/constants";
import OrdersModal from "@/components/OrdersModal";
import BalanceModal from "@/components/BalanceModal";
import CourierDeliveriesModal from "@/components/CourierDeliveriesModal";
import RestaurantModal from "@/components/RestaurantModal";

interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    available: boolean;
    imageUrl: string;
    category: string;
    restaurantId: string;
}

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    orderId: string;
    menuItemId: string;
    menuItem: MenuItem;
}

interface Restaurant {
    id: string;
    name: string;
    description: string;
    phone: string;
    ownerId: string;
    status: string;
    category: string[];
    imageUrl: string;
}

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string[];
}

interface Order {
    id: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    restaurantId: string;
    courierProfileId: string | null;
    userId: string;
    user: User;
    restaurant: Restaurant;
    CourierProfile: any | null;
    orderItems: OrderItem[];
}

const Profile = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const [isAddressOpen, setIsAddressOpen] = useState(false);
    const [isOrdersOpen, setIsOrdersOpen] = useState(false);
    const [isBalanceOpen, setIsBalanceOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [openModal, setOpenModal] = useState<"courier" | "restaurant" | null>(null);

    if (!user || user.id !== id) return <p>Uživatel nenalezen</p>;

    return (
        <div className="bg-gray-100 min-h-screen">
            <NavbarSwitcher />

            <div className="flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl w-full bg-white rounded-2xl p-6 sm:p-10 space-y-6">
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-4xl text-gray-600">
                            {user.name[0]}
                        </div>
                        <div className="text-center sm:text-left">
                            <h1 className="text-3xl sm:text-4xl font-bold flex flex-wrap justify-center sm:justify-start">
                                {user.name}
                                <div className="flex space-x-2 ml-4 items-center">
                                    {user.role.map((role) => (
                                        <span
                                            key={role}
                                            className={`px-3 py-1 rounded-full text-base text-white flex items-center justify-center leading-none ${role === 'Admin' ? 'bg-red-500' :
                                                role === 'Courier' ? 'bg-green-500' :
                                                    role === 'Restaurant' ? 'bg-purple-500' :
                                                        'bg-gray-500'
                                                }`}
                                        >
                                            {role}
                                        </span>
                                    ))}
                                </div>

                            </h1>
                            <p className="text-gray-600 mt-1">{user.email}</p>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 mt-6">
                    {[{
                        label: "Adresa", desc: "Přidejte nebo upravte vaši adresu", icon: FaMapMarkerAlt, action: () => setIsAddressOpen(true)
                    }, {
                        label: "Objednávky", desc: "Podívejte se na vaše objednávky", icon: FaListAlt, action: () => setIsOrdersOpen(true)
                    }, {
                        label: "Útraty", desc: "Zjištěte vaše poslední útraty", icon: FaWallet, action: () => setIsBalanceOpen(true)
                    }, {
                        label: "Informace", desc: "Zjistěte něco o naší službě", icon: FaInfoCircle, action: () => setIsSettingsOpen(true)
                    }].map(({ label, desc, icon: Icon, action }, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 cursor-pointer flex justify-between items-center" onClick={action}>
                            <div>
                                <p className="text-gray-500 text-sm mb-2">{desc}</p>
                                <h2 className="text-2xl font-semibold">{label}</h2>
                            </div>
                            <Icon className="text-2xl text-gray-600" />
                        </div>
                    ))}

                    {user.role.includes("Courier") ? (
                        <div className="bg-green-500 rounded-2xl p-6 cursor-pointer flex justify-between items-center text-white" onClick={() => setOpenModal("courier")}>
                            <div>
                                <p className="text-sm mb-2">Zobrazit dokončené objednávky</p>
                                <h2 className="text-2xl font-semibold">Rozvoz objednávek</h2>
                            </div>
                            <FaTruck className="text-2xl" />
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-6 cursor-pointer flex justify-between items-center" onClick={() => setOpenModal("courier")}>
                            <div>
                                <p className="text-gray-500 text-sm mb-2">Staňte se partnerským kurýrem Feedy</p>
                                <h2 className="text-2xl font-semibold">Žádost o kurýra</h2>
                            </div>
                            <FaTruck className="text-2xl text-gray-600" />
                        </div>
                    )}

                    {user.role.includes("Restaurant") ? (
                        <div className="bg-purple-500 rounded-2xl p-6 cursor-pointer flex justify-between items-center text-white" onClick={() => window.location.href = "/management"}>
                            <div>
                                <p className="text-sm mb-2">Spravujte svou restauraci</p>
                                <h2 className="text-2xl font-semibold">Management restaurace</h2>
                            </div>
                            <FaStore className="text-2xl" />
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-6 cursor-pointer flex justify-between items-center" onClick={() => setOpenModal("restaurant")}>
                            <div>
                                <p className="text-gray-500 text-sm mb-2">Přidejte vaši restauraci</p>
                                <h2 className="text-2xl font-semibold">Žádost o restauraci</h2>
                            </div>
                            <FaStore className="text-2xl text-gray-600" />
                        </div>
                    )}
                </div>
            </div>

            <Modal isOpen={isAddressOpen} onClose={() => setIsAddressOpen(false)}>
                <RestaurantModal isOpen={isAddressOpen} onClose={() => setIsAddressOpen(false)}/>
            </Modal>

            <Modal isOpen={isOrdersOpen} onClose={() => setIsOrdersOpen(false)}>
                <OrdersModal isOpen={isOrdersOpen} onClose={() => setIsOrdersOpen(false)} />
            </Modal>

            <Modal isOpen={isBalanceOpen} onClose={() => setIsBalanceOpen(false)}>
                <BalanceModal isOpen={isBalanceOpen} onClose={() => setIsBalanceOpen(false)} />
            </Modal>


            <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Informace</h2>
                <p>Feedy je online platforma pro objednávání a doručování jídel.</p>
                <p>Můžete zde objednávat jídlo, přidat vlastní podnik, nebo se stát partnerským kurýrem.</p>
                <p>Více informací naleznete na stránce o nás.</p>

                <Link href="/about">
                    <button
                        className="mt-5 w-full font-bold text-lg bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white py-3 rounded-full"
                    >O nás</button>
                </Link>
            </Modal>

            <Modal isOpen={openModal === "courier"} onClose={() => setOpenModal(null)}>
                {user.role.includes("Courier") ? (
                    <CourierDeliveriesModal isOpen={openModal === "courier"} onClose={() => setOpenModal(null)} />
                ) : (
                    <CourierForm />
                )}
            </Modal>
            <Modal isOpen={openModal === "restaurant"} onClose={() => setOpenModal(null)}>
                <RestaurantForm />
            </Modal>
        </div>
    );
};

export default Profile;