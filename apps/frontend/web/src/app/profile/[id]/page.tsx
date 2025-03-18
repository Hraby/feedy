'use client';
import NavbarSwitcher from "@/components/NavbarSwitch";
import { useAuth } from "@/contexts/AuthProvider";
import { useParams } from "next/navigation";
import { useState } from "react";
import Modal from "@/components/Modal";
import Link from "next/link";
import CourierForm from "@/components/CourierForm";
import RestaurantForm from "@/components/RestaurantForm";
import { FaMapMarkerAlt, FaListAlt, FaWallet, FaInfoCircle, FaTruck, FaStore, FaHome, FaBuilding, FaTrash, FaCalendar, FaClock } from 'react-icons/fa';
import AdminRestaurants from "@/app/admin/restaurants/page";
import { BACKEND_URL } from "@/lib/constants";

const Profile = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const [isAddressOpen, setIsAddressOpen] = useState(false);
    const [isOrdersOpen, setIsOrdersOpen] = useState(false);
    const [isBalanceOpen, setIsBalanceOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [openModal, setOpenModal] = useState<"courier" | "restaurant" | null>(null);


    const mockOrders = [
        { id: 1, items: 'Burger, Fries', date: '2023-11-15', restaurant: 'Burger King', price: 150 },
        { id: 2, items: 'Pizza Margherita', date: '2023-11-14', restaurant: 'Pizza Hut', price: 200 },
        { id: 3, items: 'Sushi Set', date: '2023-11-13', restaurant: 'Sushi Bar', price: 350 },
    ];


    const [addresses, setAddresses] = useState([
        { id: 'home', label: 'Domov', details: 'Ulice 123, Praha', type: 'home', active: true },
        { id: 'work', label: 'Práce', details: 'Office Park 456', type: 'work', active: false }
    ]);

    const [newAddress, setNewAddress] = useState("");
    const [newAddressType, setNewAddressType] = useState("");
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

    const handleSetActiveAddress = (id: string) => {
        setAddresses(prev => prev.map(addr => ({
            ...addr,
            active: addr.id === id
        })));
    };

    const handleAddAddress = () => {
        if (!newAddress) return;

        if (editingAddressId) {
            setAddresses(prev =>
                prev.map(addr => {
                    if (addr.id === editingAddressId) {
                        const label = newAddressType === 'home' ? 'Domov' : newAddressType === 'work' ? 'Práce' : 'Jiné';
                        return { ...addr, details: newAddress, type: newAddressType, label: label };
                    }
                    return addr;
                })
            );
            setEditingAddressId(null);
        } else {
            const id = `${newAddressType}-${Date.now()}`;
            const label = newAddressType === 'home' ? 'Domov' : newAddressType === 'work' ? 'Práce' : 'Jiné';

            setAddresses(prev => [
                ...prev,
                { id, label, details: newAddress, type: newAddressType, active: false }
            ]);
        }

        setNewAddress("");
        setNewAddressType("home");
    };

    const handleEditAddress = (id: string, details: string, type: string) => {
        setNewAddress(details);
        setNewAddressType(type);
        setEditingAddressId(id);
    };


    const handleDeleteAddress = (id: string) => {
        setAddresses((prev) => prev.filter((address) => address.id !== id));
    };

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
                                <div className="flex space-x-2 ml-4">
                                    {user.role.map((role) => (
                                        <span
                                            key={role}
                                            className={`px-3 rounded-full text-base text-white flex items-center justify-center ${role === 'Admin' ? 'bg-red-500' : role === 'Courier' ? 'bg-green-500' : role === 'Restaurant' ? 'bg-purple-500' : 'bg-gray-500'}`}
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
                <h2 className="text-xl font-bold mb-4">Adresa</h2>
                {addresses.map((address) => (
                    <div
                        key={address.id}
                        className={`relative flex items-center gap-2 p-2 rounded-2xl cursor-pointer w-full transition-all duration-300 ease-in-out ${address.active ? 'bg-[var(--primary-light)] hover:bg-gray-100' : 'hover:bg-gray-100'}`}
                        onClick={() => handleSetActiveAddress(address.id)}
                    >
                        <span className={`rounded-full p-2 transition-all duration-300 ease-in-out ${address.active ? 'bg-[var(--primary)]' : 'bg-[#EFEFEF]'}`}>
                            {address.type === 'home' ? (
                                <FaHome className={address.active ? 'text-white' : 'text-[var(--font)]'} />
                            ) : address.type === 'work' ? (
                                <FaBuilding className={address.active ? 'text-white' : 'text-[var(--font)]'} />
                            ) : (
                                <FaMapMarkerAlt className={address.active ? 'text-white' : 'text-[var(--font)]'} />
                            )}
                        </span>
                        <div>
                            <span className={address.active ? 'text-[var(--primary)] font-bold' : ''}>{address.label}</span><p className="text-sm text-gray-600">{address.details}</p>
                        </div>

                        <div className="flex gap-2 ml-auto">
                            <button
                                type="button"
                                onClick={() => handleEditAddress(address.id, address.details, address.type)}
                                className="text-gray-700 group"
                            >
                                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 transition-colors group-hover:bg-blue-600">
                                    <FaInfoCircle size={15} className="text-gray-700 group-hover:text-white" />
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDeleteAddress(address.id)}
                                className="text-gray-700 group"
                            >
                                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 transition-colors group-hover:bg-red-600">
                                    <FaTrash size={15} className="text-gray-700 group-hover:text-white" />
                                </div>
                            </button>
                        </div>
                    </div>
                ))}
                <div className="mt-6 bg-gray-50 p-6 rounded-2xl shadow-md space-y-4">
                    <label className="block">
                        <span className="text-gray-700 font-medium"> Zadejte novou adresu</span>
                        <input
                            type="text"
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                            placeholder="Hlavní 123, Praha"
                            className="input-field"
                            required
                        />
                    </label>

                    <label className="block">
                        <span className="text-gray-700 font-medium"> Typ adresy</span>
                        <select
                            value={newAddressType}
                            onChange={(e) => setNewAddressType(e.target.value)}
                            className="input-field"
                            required
                        >
                            <option value="home">Domov</option>
                            <option value="work">Práce</option>
                            <option value="other">Jiné</option>
                        </select>
                    </label>

                    <button
                        onClick={handleAddAddress}
                        className="w-full bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white font-bold py-3 rounded-full hover:opacity-90 transition duration-200"
                    >
                        {editingAddressId ? "Uložit změny" : "Přidat adresu"}
                    </button>
                </div>
            </Modal>

            <Modal isOpen={isOrdersOpen} onClose={() => setIsOrdersOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Objednávky</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="sticky top-0 bg-white z-20">
                            <tr className="border-b">
                                <th className="p-4">Položky</th>
                                <th className="p-4">Datum</th>
                                <th className="p-4">Restaurace</th>
                                <th className="p-4">Cena</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockOrders.map((order) => (
                                <tr key={order.id} className="border-b hover:bg-gray-100">
                                    <td className="p-4">{order.items}</td>
                                    <td className="p-4">{order.date}</td>
                                    <td className="p-4">{order.restaurant}</td>
                                    <td className="p-4">{order.price} Kč</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Modal>

            <Modal isOpen={isBalanceOpen} onClose={() => setIsBalanceOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Útraty</h2>
                <div className="mt-6 bg-gray-50 p-6 rounded-2xl space-y-4">
                    <div className="text-center">
                        <p className="text-sm mb-2">Celkové útraty</p>
                        <h2 className="text-4xl font-semibold">250.00 Kč</h2>
                    </div>
                </div>
                <div className="max-w-6xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="mt-6 bg-gray-50 p-6 rounded-2xl space-y-4">
                        <div className="text-center">
                            <div className="flex justify-center">
                                <FaCalendar className="text-[var(--primary)] text-3xl" />
                            </div>
                            <p className="text-sm mt-3 mb-1">Tento měsíc</p>
                            <h2 className="text-2xl font-semibold">150.00 Kč</h2>
                        </div>
                    </div>
                    <div className="mt-6 bg-gray-50 p-6 rounded-2xl space-y-4">
                        <div className="text-center">
                            <div className="flex justify-center">
                                <FaClock className="text-[var(--primary)] text-3xl" />
                            </div>
                            <p className="text-sm mt-3 mb-1">Průměrná objednávka</p>
                            <h2 className="text-2xl font-semibold">150.00 Kč</h2>
                        </div>
                    </div>
                </div>
            </Modal>


            <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Informace</h2>
            </Modal>

            <Modal isOpen={openModal === "courier"} onClose={() => setOpenModal(null)}>
                {user.role.includes("Courier") ? (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Dokončené objednávky</h2>
                        <p>Zde budou zobrazeny objednávky, které jste již rozvezli.</p>
                    </div>
                ) : (
                    <CourierForm />
                )}
            </Modal>
            <Modal isOpen={openModal === "restaurant"} onClose={() => setOpenModal(null)}>
                <RestaurantForm />
            </Modal>
            <style jsx>{`
                .input-field {
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #e5e7eb;
                    border-radius: 10px;
                    font-size: 16px;
                    transition: border-color 0.2s, background-color 0.2s;
                }
                .input-field:focus {
                    border-color: #9ca3af;
                    background-color: #f3f4f6;
                    outline: none;
                }
            `}</style>
        </div>
    );
};

export default Profile;