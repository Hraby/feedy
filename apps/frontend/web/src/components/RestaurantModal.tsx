import { useAuth } from "@/contexts/AuthProvider";
import { useEffect, useState } from "react";
import { FaBuilding, FaHome, FaInfoCircle, FaMapMarkerAlt, FaCog, FaTimes, FaTrash } from "react-icons/fa";
import AutoComplete from "./autoComplete";

export default function RestaurantModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { address } = useAuth();

    const [addresses, setAddresses] = useState([
        { id: 'home', label: 'Domov', details: 'Ulice 123, Praha', type: 'home', active: true },
    ]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
    const [newAddressType, setNewAddressType] = useState("home");

    useEffect(() => {
        if (address) {
            setAddresses([{ id: "home", label: "Domov", details: `${address.street}, ${address.zipCode}, ${address.city}, ${address.country}`, type: "home", active: true }]);
        } else {
            setAddresses([{ id: "home", label: "Domov", details: "náměstí Míru 12, 760 01, Zlín, Czechia", type: "home", active: true }]);
        }
    }, [address]);

    const handleAddressSelect = (selectedAddress: { street: string; zipCode: string; city: string; country: string }) => {
        const details = `${selectedAddress.street}, ${selectedAddress.zipCode}, ${selectedAddress.city}, ${selectedAddress.country}`;
        if (editingAddressId) {
            setAddresses(prev =>
                prev.map(addr => {
                    if (addr.id === editingAddressId) {
                        const label = newAddressType === 'home' ? 'Domov' : newAddressType === 'work' ? 'Práce' : 'Jiné';
                        return { ...addr, details: details, type: newAddressType, label: label };
                    }
                    return addr;
                })
            );
            setEditingAddressId(null);
        }
        setIsEditing(false);
    };

    const handleEditAddress = (id: string, details: string, type: string) => {
        setEditingAddressId(id);
        setNewAddressType(type);
        setIsEditing(true);
    };

    const handleDeleteAddress = (id: string) => {
        const addressToDelete = addresses.find(addr => addr.id === id);
        if (!addressToDelete) return;

        const isFirstAddress = addresses[0]?.id === id;
        if (isFirstAddress) {
            alert("První adresu nelze smazat.");
            return;
        }

        setAddresses(prev => prev.filter((address) => address.id !== id));
    };

    const handleSetActiveAddress = (id: string) => {
        setAddresses(prev => prev.map(addr => ({
            ...addr,
            active: addr.id === id
        })));
    };

    return (
        <div className="overflow-y-auto max-h-[70vh]">
            <h2 className="text-xl font-bold mb-4">Adresa</h2>

            <p className="text-sm text-gray-500 mb-4">Dostupná města: Zlín, Brno, Praha.</p>

            {addresses.map((address, index) => (
                <div
                    key={address.id}
                    className={`relative flex items-center gap-2 p-4 rounded-2xl cursor-pointer w-full transition-all duration-300 ease-in-out ${address.active ? 'bg-[var(--primary-light)] hover:bg-gray-100' : 'hover:bg-gray-100'}`}
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
                        <span className={address.active ? 'text-[var(--primary)] font-bold' : ''}>{address.label}</span>
                        <p className="text-sm text-gray-600">{address.details}</p>
                    </div>

                    <div className="flex gap-2 ml-auto">
                        <button
                            type="button"
                            onClick={() => handleEditAddress(address.id, address.details, address.type)}
                            className="text-gray-700 group"
                        >
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 transition-colors group-hover:bg-blue-600">
                                <FaCog size={15} className="text-gray-700 group-hover:text-white" />
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-gray-700 group"
                            disabled={index === 0 || address.active}
                        >
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 transition-colors group-hover:bg-red-600 ${index === 0 || address.active ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <FaTrash size={15} className={`text-gray-700 group-hover:text-white ${index === 0 || address.active ? 'text-gray-400 group-hover:text-gray-400' : ''}`} />
                            </div>
                        </button>
                    </div>
                </div>
            ))}

            <div className="mt-6 bg-gray-50 p-6 rounded-2xl space-y-4">
                {isEditing ? (
                    <>
                        <label className="block">
                            <span className="text-gray-700 font-medium">Upravit adresu</span>
                            <AutoComplete
                                onClose={() => setIsEditing(false)}
                                onSelect={handleAddressSelect}
                                existingAddress={editingAddressId}
                                className="z-40"
                            />
                        </label>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="w-full text-gray-600 font-bold py-3 rounded-full hover:opacity-90 transition duration-200 border border-gray-300 flex items-center justify-center gap-2"
                        >
                            <FaTimes /> Zrušit
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="w-full bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white font-bold py-3 rounded-full hover:opacity-90 transition duration-200 flex items-center justify-center gap-2"
                    >
                        Upravit adresu
                    </button>
                )}
            </div>
        </div>
    );
}
