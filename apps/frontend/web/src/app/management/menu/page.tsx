'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { FaPlus } from 'react-icons/fa';
import ManagementSidebar from '@/components/ManagementSidebar';
import Modal from '@/components/Modal';
import ItemForm from '@/components/ItemForm';

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
}

const ManagementMenu = () => {
    const pathname = usePathname();
    const [menuItems, setMenuItems] = useState<MenuItem[]>([
        {
            id: 1,
            name: "Pizza Margherita",
            description: "Klasická pizza s rajčaty, mozzarellou a bazalkou.",
            price: 189,
            category: "Pizza",
            image: "/img/burger.png"
        },
        {
            id: 2,
            name: "Hovězí burger",
            description: "Šťavnatý burger s čedarem a karamelizovanou cibulkou.",
            price: 229,
            category: "Burgery",
            image: "/img/burger.png"
        }
    ]);

    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEditItem = (item: MenuItem) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleAddNewItem = () => {
        setSelectedItem(null);
        setIsModalOpen(true);
    };

    const handleSaveItem = (item: MenuItem) => {
        if (item.id) {
            setMenuItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
        } else {
            setMenuItems((prev) => [...prev, { ...item, id: Date.now() }]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <div className="w-64 fixed top-0 left-0 h-screen">
                <ManagementSidebar activePath={pathname} />
            </div>

            <main className="flex-1 p-8 ml-64 min-h-screen">
                <h2 className="text-4xl font-bold mb-2">Menu</h2>
                <p className="text-gray-600 mb-8">Spravujte položky z jednoho místa.</p>

                <div className="grid grid-cols-5 gap-4">
                    {menuItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white p-4 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition flex flex-col items-center"
                            onClick={() => handleEditItem(item)}
                        >
                            <div className="flex justify-center items-center mb-4">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="max-xl max-h-xl object-contain"
                                />
                            </div>
                            <div className="h-[20px]">
                                <h3 className="text-lg font-semibold truncate text-center">{item.name}</h3>
                            </div>
                            <div className="h-[40px] ">
                                <p className="text-gray-500 text-sm line-clamp-2 mt-3 text-center">{item.description}</p>
                            </div>
                            <p className="text-[var(--gradient-purple-end)] text-2xl font-bold mt-3 text-center">{item.price} Kč</p>
                        </div>
                    ))}

                    <div
                        className="bg-gradient-to-r from-[var(--gradient-purple-start)] to-[var(--gradient-purple-end)] p-6 rounded-2xl text-white flex flex-col justify-center items-center cursor-pointer hover:opacity-90 transition"
                        onClick={handleAddNewItem}
                    >
                        <FaPlus className="text-4xl mb-6" />
                        <p className="text-lg">Přidat novou položku</p>
                    </div>
                </div>

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <ItemForm item={selectedItem} onSave={handleSaveItem} />
                </Modal>
            </main>
        </div>
    );
};

export default ManagementMenu;