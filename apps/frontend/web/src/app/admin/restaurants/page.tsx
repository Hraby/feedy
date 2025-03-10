'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { useState, useEffect } from 'react';
import { FaTrash, FaCog } from 'react-icons/fa';
import Modal from '@/components/Modal';

interface Restaurant {
    id: number;
    name: string;
    owner: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}

const statuses = ['Pending', 'Approved', 'Rejected'] as const;

const initialRestaurants: Restaurant[] = [
    { id: 1, name: 'Pizzerie Bella', owner: 'Jan Novák', status: 'Pending' },
    { id: 2, name: 'Sushi House', owner: 'Michaela Veselá', status: 'Approved' },
    { id: 3, name: 'Healthy Bites', owner: 'Petr Malý', status: 'Rejected' },
];

const AdminRestaurants = () => {
    const pathname = usePathname();
    const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants);
    const [editingRestaurantId, setEditingRestaurantId] = useState<number | null>(null);
    const [deleteRestaurantId, setDeleteRestaurantId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if ((event.target as HTMLElement).closest('.dropdown') === null) {
                    setEditingRestaurantId(null);
                }
            };
    
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

    const handleStatusChange = (id: number, status: Restaurant['status']) => {
        setRestaurants(restaurants.map(restaurant => (
            restaurant.id === id ? { ...restaurant, status } : restaurant
        )));
    };

    const handleDeleteRestaurant = (id: number) => {
        setDeleteRestaurantId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteRestaurant = () => {
        if (deleteRestaurantId !== null) {
            setRestaurants(restaurants.filter(restaurant => restaurant.id !== deleteRestaurantId));
            setDeleteRestaurantId(null);
            setIsDeleteModalOpen(false);
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
                                <tr key={restaurant.id} className="border-b">
                                    <td className="p-4">#{restaurant.id}</td>
                                    <td className="p-4">{restaurant.name}</td>
                                    <td className="p-4">{restaurant.owner}</td>
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
                                            className="text-gray-700 group"
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
                </div>
            </main>

            <Modal isOpen={isDeleteModalOpen} onClose={cancelDeleteRestaurant}>
                <h2 className="text-lg font-semibold mb-2">Opravdu chcete odstranit restauraci?</h2>
                <p className="text-gray-600 mb-4">Toto rozhodnutí nelze vrátit zpět.</p>
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