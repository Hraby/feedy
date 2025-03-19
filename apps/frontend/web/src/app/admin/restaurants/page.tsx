'use client';

import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { useState, useEffect } from 'react';
import { FaTrash, FaCog } from 'react-icons/fa';
import Modal from '@/components/Modal';
import { deleteRestaurant, fetchRestaurants, updateRestaurantStatus } from '@/app/actions/adminAction';
import { useAuth } from '@/contexts/AuthProvider';
import { toast, Slide } from 'react-toastify';

interface Restaurant {
    id: string;
    name: string;
    description: string;
    phone: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    owner: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string[];
    };
}

const statuses = ['Pending', 'Approved', 'Rejected'] as const;

const AdminRestaurants = () => {
    const pathname = usePathname();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [editingRestaurantId, setEditingRestaurantId] = useState<string | null>(null);
    const [deleteRestaurantId, setDeleteRestaurantId] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const {accessToken} = useAuth();

    useEffect(() => {
        const loadRestaurants = async () => {
            if (!accessToken) return;
            
            setLoading(true);
            try {
                const data = await fetchRestaurants(accessToken);
                setRestaurants(data);
                setError(null);
            } catch (err) {
                console.log(err);
                setError('Nepodařilo se načíst uživatele');
            } finally {
                setLoading(false);
            }
        };

        loadRestaurants();
    }, [accessToken]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if ((event.target as HTMLElement).closest('.dropdown') === null) {
                setEditingRestaurantId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleStatusChange = async (id: string, status: Restaurant['status']) => {
        if (!accessToken) return;

        try {
            await updateRestaurantStatus(id, accessToken, status);
            setRestaurants(restaurants.map(restaurant =>
                restaurant.id === id ? { ...restaurant, status } : restaurant
            ));
            setEditingRestaurantId(null);
            toast.success("Status restaurace byl upraven!", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Slide,
            });
        } catch (error) {
            console.log(error);
            toast.error("Chyba při aktualizaci statusu.", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Slide,
            });
        }
    };

    const handleDeleteRestaurant = (id: string) => {
        setDeleteRestaurantId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteRestaurant = async () => {
        if (!deleteRestaurantId || !accessToken) return;

        try {
            await deleteRestaurant(deleteRestaurantId, accessToken);
            setRestaurants(restaurants.filter(restaurant => restaurant.id !== deleteRestaurantId));
        } catch (error) {
            console.log(error);
        } finally {
            setDeleteRestaurantId(null);
            setIsDeleteModalOpen(false);
            toast.success("Restaurace byla úspěšně smazána z databáze!", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Slide,
            });
        }
    };

    const cancelDeleteRestaurant = () => {
        setDeleteRestaurantId(null);
        setIsDeleteModalOpen(false);
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <div className="w-64 fixed top-0 left-0 h-screen">
                <AdminSidebar activePath={pathname} />
            </div>

            <main className="flex-1 p-8 ml-64 min-h-screen">
                <h2 className="text-4xl font-bold mb-2">Správa restaurací</h2>
                <p className="text-gray-600 mb-8">Spravujte restaurace z jednoho místa.</p>

                <div className="bg-white p-6 rounded-3xl shadow-sm">
                {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <svg className="animate-spin h-8 w-8 text-[var(--primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="ml-3 text-gray-600">Načítání restaurací...</span>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500">
                            <p>{error}</p>
                        </div>
                    ) : (
                    <table className="w-full text-left">
                        <thead className="sticky top-0 bg-white z-20">
                            <tr className="border-b">
                                <th className="p-4">ID</th>
                                <th className="p-4">Název</th>
                                <th className="p-4">Majitel</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Akce</th>
                            </tr>
                        </thead>
                        <tbody>
                            {restaurants.map((restaurant) => (
                                <tr key={restaurant.id} className="border-b hover:bg-gray-100">
                                    <td className="p-4">{restaurant.id}</td>
                                    <td className="p-4">{restaurant.name}</td>
                                    <td className="p-4">{restaurant.owner.firstName} {restaurant.owner.lastName}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-xl text-white ${restaurant.status === 'Pending' ? 'bg-gray-500' : restaurant.status === 'Approved' ? 'bg-green-500' : 'bg-red-500'}`}>
                                            {restaurant.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-4 relative">
                                        <button
                                            type="button"
                                            onClick={() => setEditingRestaurantId(restaurant.id)}
                                            className="text-gray-700 group"
                                        >
                                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 transition-colors group-hover:bg-blue-600">
                                                <FaCog size={20} className="text-gray-700 group-hover:text-white" />
                                            </div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteRestaurant(restaurant.id)}
                                            className="text-gray-700 group pt-2"
                                        >
                                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 transition-colors group-hover:bg-red-600">
                                                <FaTrash size={20} className="text-gray-700 group-hover:text-white" />
                                            </div>
                                        </button>

                                        {editingRestaurantId === restaurant.id && (
                                            <div className="dropdown absolute right-0 w-60 mt-2 bg-white border p-4 rounded-xl shadow-lg z-10">
                                                <h4 className="text-lg text-center font-semibold mb-4">Změnit status</h4>
                                                {statuses.map((status) => (
                                                    <label key={status} className="flex items-center gap-3 mb-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            value={status}
                                                            checked={restaurant.status === status}
                                                            onChange={() => handleStatusChange(restaurant.id, status)}
                                                            className="w-5 h-5 rounded-2xl accent-[var(--primary)]"
                                                        />
                                                        <span>{status}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    )}
                </div>
            </main>

            <Modal isOpen={isDeleteModalOpen} onClose={cancelDeleteRestaurant}>
                <h2 className="text-lg font-semibold mb-2">Odstranit restauraci</h2>
                <p className="text-gray-600">Opravdu chcete odstranit tuto restauraci?</p>
                <p className="text-red-600 mb-4">Tato akce nelze vrátit zpět!</p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={cancelDeleteRestaurant}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        Zrušit
                    </button>
                    <button
                        onClick={confirmDeleteRestaurant}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        Odstranit
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default AdminRestaurants;