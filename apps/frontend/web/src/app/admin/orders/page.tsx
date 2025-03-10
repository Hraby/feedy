'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { useState, useEffect } from 'react';
import { FaTrash, FaCog } from 'react-icons/fa';
import Modal from '@/components/Modal';

export interface AdminSidebarProps {
    activePath: string;
}

interface Order {
    id: number;
    items: string[];
    status: 'Pending' | 'Accepted' | 'Preparing' | 'Out For Delivery' | 'Delivered' | 'Cancelled';
    orderDate: string;
    orderTime: string;
    restaurantName: string;
    courier: string | null;
}

const statuses = ['Pending', 'Accepted', 'Preparing', 'Out For Delivery', 'Delivered', 'Cancelled'] as const;

const initialOrders: Order[] = [
    { id: 101, status: 'Pending', items: ['Pizza', 'Burger'], orderDate: '2024-03-01', orderTime: '14:30', restaurantName: 'Pizzerie Bella', courier: 'Jan Novák' },
    { id: 102, status: 'Preparing', items: ['Sushi', 'Ramen'], orderDate: '2024-03-02', orderTime: '12:15', restaurantName: 'Sushi House', courier: null },
    { id: 103, status: 'Delivered', items: ['Pasta'], orderDate: '2024-03-03', orderTime: '18:45', restaurantName: 'Italiano Ristorante', courier: 'Petr Malý' },
    { id: 104, status: 'Cancelled', items: ['Salad'], orderDate: '2024-03-04', orderTime: '09:00', restaurantName: 'Healthy Bites', courier: null },
];

const AdminOrders = () => {
    const pathname = usePathname();
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
    const [deleteOrderId, setDeleteOrderId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if ((event.target as HTMLElement).closest('.dropdown') === null) {
                setEditingOrderId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleStatusChange = (id: number, status: Order['status']) => {
        setOrders(orders.map(order => (
            order.id === id ? { ...order, status } : order
        )));
    };

    const handleDeleteOrder = (id: number) => {
        setDeleteOrderId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteOrder = () => {
        if (deleteOrderId !== null) {
            setOrders(orders.filter(order => order.id !== deleteOrderId));
            setDeleteOrderId(null);
            setIsDeleteModalOpen(false);
        }
    };

    const cancelDeleteOrder = () => {
        setDeleteOrderId(null);
        setIsDeleteModalOpen(false);
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <div className="w-64 fixed top-0 left-0 h-screen">
                <AdminSidebar activePath={pathname} />
            </div>

            <main className="flex-1 p-8 ml-64 min-h-screen">
                <h2 className="text-4xl font-bold mb-2">Správa objednávek</h2>
                <p className="text-gray-600 mb-8">Spravujte objednávky z jednoho místa.</p>

                <div className="bg-white p-6 rounded-3xl shadow-sm">
                    <table className="w-full text-left">
                        <thead className="sticky top-0 bg-white z-20">
                            <tr className="border-b">
                                <th className="p-4">ID</th>
                                <th className="p-4 w-1/6">Položky</th>
                                <th className="p-4 w-1/6">Status</th>
                                <th className="p-4">Datum a čas</th>
                                <th className="p-4">Restaurace</th>
                                <th className="p-4">Kurýr</th>
                                <th className="p-4 text-right">Akce</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-b">
                                    <td className="p-4">#{order.id}</td>
                                    <td className="p-4">{order.items.join(', ')}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-xl text-white ${order.status === 'Pending' ? 'bg-gray-500' : order.status === 'Accepted' ? 'bg-blue-500' : order.status === 'Preparing' ? 'bg-yellow-500' : order.status === 'Out For Delivery' ? 'bg-purple-500' : order.status === 'Delivered' ? 'bg-green-500' : 'bg-red-500'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4">{order.orderDate} {order.orderTime}</td>
                                    <td className="p-4">{order.restaurantName}</td>
                                    <td className="p-4">{order.courier || 'Nepřiřazený'}</td>
                                    <td className="p-4 text-right space-x-4 relative">
                                        <button
                                            type="button"
                                            onClick={() => setEditingOrderId(order.id)}
                                            className="text-gray-700 group"
                                        >
                                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 transition-colors group-hover:bg-blue-600">
                                                <FaCog size={20} className="text-gray-700 group-hover:text-white" />
                                            </div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteOrder(order.id)}
                                            className="text-gray-700 group"
                                        >
                                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 transition-colors group-hover:bg-red-600">
                                                <FaTrash size={20} className="text-gray-700 group-hover:text-white" />
                                            </div>
                                        </button>

                                        {editingOrderId === order.id && (
                                            <div className="dropdown absolute right-0 w-60 mt-2 bg-white border p-4 rounded-xl shadow-lg z-10">
                                                <h4 className="text-lg text-center font-semibold mb-4">Změnit status</h4>
                                                {statuses.map((status) => (
                                                    <label key={status} className="flex items-center gap-3 mb-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            value={status}
                                                            checked={order.status === status}
                                                            onChange={() => handleStatusChange(order.id, status)}
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

            <Modal isOpen={isDeleteModalOpen} onClose={cancelDeleteOrder}>
                <h2 className="text-lg font-semibold mb-2">Opravdu chcete odstranit objednávku?</h2>
                <p className="text-gray-600 mb-4">Toto rozhodnutí nelze vrátit zpět.</p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={cancelDeleteOrder}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        Zrušit
                    </button>
                    <button
                        onClick={confirmDeleteOrder}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        Odstranit
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default AdminOrders;