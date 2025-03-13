'use client';
import NavbarSwitcher from "@/components/NavbarSwitch";
import { useAuth } from "@/contexts/AuthProvider";
import { useParams } from "next/navigation";
import { useState } from "react";
import Modal from "@/components/Modal";
import CourierForm from "@/components/CourierForm";
import RestaurantForm from "@/components/RestaurantForm";
import { FaMapMarkerAlt, FaListAlt, FaWallet, FaCog, FaTruck, FaStore } from 'react-icons/fa';

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
        <div className="bg-gray-100 h-screen">
            <NavbarSwitcher />

            <div className="flex flex-col items-center py-10">
                <div className="max-w-6xl w-full bg-white  rounded-2xl p-10 space-y-6">
                    <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-4xl text-gray-600">
                            {user.name[0]}
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold flex items-center">
                                {user.name}
                                <div className="flex space-x-2 ml-4">
                                    {user.role.map((role) => (
                                        <span key={role} className={`px-2 py-0.5 rounded-lg text-lg text-white ${role === 'Admin' ? 'bg-red-500' : role === 'Courier' ? 'bg-green-500' : role === 'Restaurant' ? 'bg-purple-500' : 'bg-gray-500'}`}>
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            </h1>
                            <p className="text-gray-600 mt-1">{user.email}</p>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl w-full grid grid-cols-2 gap-6 mt-6">
                    <div className="bg-white rounded-2xl p-6 cursor-pointer flex justify-between items-center" onClick={() => setIsAddressOpen(true)}>
                        <div>
                            <p className="text-gray-500 text-sm mb-2">Přidejte nebo upravte vaši adresu</p>
                            <h2 className="text-2xl font-semibold">Adresa</h2>
                        </div>
                        <FaMapMarkerAlt className="text-2xl text-gray-600" />
                    </div>
                    <div className="bg-white rounded-2xl p-6 cursor-pointer flex justify-between items-center" onClick={() => setIsOrdersOpen(true)}>
                        <div>
                            <p className="text-gray-500 text-sm mb-2">Podívejte se na vaše objednávky</p>
                            <h2 className="text-2xl font-semibold">Objednávky</h2>
                        </div>
                        <FaListAlt className="text-2xl text-gray-600" />
                    </div>
                    <div className="bg-white rounded-2xl p-6 cursor-pointer flex justify-between items-center" onClick={() => setIsBalanceOpen(true)}>
                        <div>
                            <p className="text-gray-500 text-sm mb-2">Dobijte si kredit pro objednávky</p>
                            <h2 className="text-2xl font-semibold">Zůstatek</h2>
                        </div>
                        <FaWallet className="text-2xl text-gray-600" />
                    </div>
                    <div className="bg-white rounded-2xl p-6 cursor-pointer flex justify-between items-center" onClick={() => setIsSettingsOpen(true)}>
                        <div>
                            <p className="text-gray-500 text-sm mb-2">Upravte si profil, jak jen chcete</p>
                            <h2 className="text-2xl font-semibold">Nastavení</h2>
                        </div>
                        <FaCog className="text-2xl text-gray-600" />
                    </div>
                    <div className="bg-white rounded-2xl p-6 cursor-pointer flex justify-between items-center" onClick={() => setOpenModal("courier")}>
                        <div>
                            <p className="text-gray-500 text-sm mb-2">Staňte se partnerským kurýrem feedy</p>
                            <h2 className="text-2xl font-semibold">Žádost o kurýra</h2>
                        </div>
                        <FaTruck className="text-2xl text-gray-600" />
                    </div>
                    <div className="bg-white rounded-2xl p-6 cursor-pointer flex justify-between items-center" onClick={() => setOpenModal("restaurant")}>
                        <div>
                            <p className="text-gray-500 text-sm mb-2">Přidejte vaši restauraci</p>
                            <h2 className="text-2xl font-semibold">Žádost o restauraci</h2>
                        </div>
                        <FaStore className="text-2xl text-gray-600" />
                    </div>
                </div>
            </div>

            <Modal isOpen={isAddressOpen} onClose={() => setIsAddressOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Adresa</h2>
            </Modal>

            <Modal isOpen={isOrdersOpen} onClose={() => setIsOrdersOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Objednávky</h2>
            </Modal>
            <Modal isOpen={isBalanceOpen} onClose={() => setIsBalanceOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Zůstatek</h2>
            </Modal>
            <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Nastavení</h2>
            </Modal>

            <Modal isOpen={openModal === "courier"} onClose={() => setOpenModal(null)}>
                <CourierForm />
            </Modal>
            <Modal isOpen={openModal === "restaurant"} onClose={() => setOpenModal(null)}>
                <RestaurantForm />
            </Modal>
        </div>
    );
};

export default Profile;