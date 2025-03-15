'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { FaPlus } from 'react-icons/fa';
import ManagementSidebar from '@/components/ManagementSidebar';
import Modal from '@/components/Modal';
import ItemForm from '@/components/ItemForm';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthProvider';
import { createMenuItem, deleteMenuItem, getMenu, updateMenuItem } from '@/app/actions/adminAction';

interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    available: boolean;
}

const ManagementMenu = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const { accessToken } = useAuth();
    const restaurantId = searchParams.get("restaurantId");

    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!accessToken || !restaurantId) return;
        
        const fetchMenu = async () => {
            try {
                const menuData = await getMenu(accessToken, restaurantId);
                setMenuItems(menuData);
            } catch (error) {
                toast.error("Nepodařilo se načíst menu.");
            }
        };
    
        fetchMenu();
    }, [accessToken, restaurantId]);

    const handleEditItem = (item: MenuItem) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleAddNewItem = () => {
        setSelectedItem(null);
        setIsModalOpen(true);
    };

    const handleSaveItem = async (item: MenuItem) => {
        if (!accessToken || !restaurantId) return;

        try {
            if (item.id != "") {
                await updateMenuItem(accessToken, restaurantId, item.id.toString(), item);
                setMenuItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
                toast.success(`Položka ${item.name} byla upravena!`);
            } else {
                const newItem = await createMenuItem(accessToken, restaurantId, "", item);
                setMenuItems((prev) => [...prev, newItem]);
                toast.success(`Položka ${newItem.name} byla přidána!`);
            }
        } catch (error) {
            toast.error("Chyba při ukládání položky.");
        }
        setIsModalOpen(false);
    };

    const handleDeleteItem = async (id: string) => {
        if (!accessToken || !restaurantId) return;

        try {
            await deleteMenuItem(accessToken, restaurantId, id.toString(), {});
            setMenuItems((prev) => prev.filter((item: any) => item.id !== id));
            toast.success(`Položka byla smazána!`);
        } catch (error) {
            toast.error("Chyba při mazání položky.");
        }
        setIsModalOpen(false);
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <div className="w-64 fixed top-0 left-0 h-screen">
                <ManagementSidebar activePath={pathname} />
            </div>

            <main className="flex-1 p-4 sm:p-8 ml-64 min-h-screen">
                <h2 className="text-3xl sm:text-4xl font-bold mb-2">Menu</h2>
                <p className="text-gray-600 mb-8">Spravujte položky z jednoho místa.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {menuItems.map((item:any, index) => (
                        <div
                            key={index}
                            className="bg-white p-4 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition flex flex-col items-center"
                            onClick={() => handleEditItem(item)}
                        >
                            <div className="w-24 h-24 sm:w-32 sm:h-32 flex justify-center items-center mb-4">
                                <img
                                    src="/img/burger.png"
                                    alt={item.name}
                                    className="max-w-full max-h-full object-contain rounded-lg"
                                />
                            </div>
                            <div className="h-[28px] flex items-center">
                                <h3 className="text-xl font-semibold truncate text-center">{item.name}</h3>
                            </div>
                            <div className="h-[56px] flex items-center">
                                <p className="text-gray-500 text-sm line-clamp-2 text-center">{item.description}</p>
                            </div>
                            <div className="flex flex-col 2xl:flex-row justify-between items-center w-full mt-3 space-y-2 md:space-y-1 xl:text-center">
                                <div className="flex flex-row">
                                    <span className={item.available ? "bg-green-100 text-green-600 text-sm font-semibold px-3 py-1 rounded-full" : "bg-red-100 text-red-600 text-sm font-semibold px-3 py-1 rounded-full"}>
                                        {item.available ? 'Dostupné' : 'Nedostupné'}
                                    </span>
                                    <span className="bg-gray-100 text-gray-600 text-sm font-semibold px-3 py-1 rounded-full">
                                        {item.category}
                                    </span>
                                </div>
                                <p className="text-[var(--gradient-purple-end)] text-2xl font-bold">{item.price} Kč</p>
                            </div>
                        </div>
                    ))}

                    <div
                        className="bg-gradient-to-r from-[var(--gradient-purple-start)] to-[var(--gradient-purple-end)] p-12 sm:p-20 rounded-2xl text-white flex flex-col text-center justify-center items-center cursor-pointer hover:opacity-90 transition"
                        onClick={handleAddNewItem}
                    >
                        <FaPlus className="text-3xl sm:text-4xl mb-4 sm:mb-6" />
                        <p className="text-base sm:text-lg">Přidat novou položku</p>
                    </div>
                </div>
                <ToastContainer />

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <ItemForm item={selectedItem} onSave={handleSaveItem} onDelete={handleDeleteItem} />
                </Modal>

            </main>
        </div>
    );
};

export default ManagementMenu;