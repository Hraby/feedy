'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Modal from '@/components/Modal';
import ManagementSidebar from '@/components/ManagementSidebar';

interface Order {
    id: number;
    items: string[];
    status: 'Pending' | 'Accepted' | 'Preparing' | 'Out For Delivery' | 'Delivered' | 'Cancelled';
    orderDate: string;
    orderTime: string;
    restaurantName: string;
    courier: string | null;
    new: boolean;
}

const initialOrders: Order[] = [
    { id: 101, status: 'Accepted', items: ['Pizza', 'Burger'], orderDate: '2024-03-01', orderTime: '14:30', restaurantName: 'Pizzerie Bella', courier: 'Jan Novák', new: true },
    { id: 102, status: 'Preparing', items: ['Sushi', 'Ramen'], orderDate: '2024-03-02', orderTime: '12:15', restaurantName: 'Sushi House', courier: null, new: false },
];

const ManagementOrders = () => {
    const pathname = usePathname();
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [modalOrderId, setModalOrderId] = useState<number | null>(null);
    const [modalType, setModalType] = useState<'accept' | 'ready' | null>(null);

    const openModal = (id: number, type: 'accept' | 'ready') => {
        setModalOrderId(id);
        setModalType(type);
    };

    const closeModal = () => {
        setModalOrderId(null);
        setModalType(null);
    };

    const handleConfirmAction = () => {
        if (modalOrderId !== null) {
            setOrders((prevOrders) =>
                prevOrders.map((order) => {
                    if (order.id === modalOrderId) {
                        if (modalType === 'accept') {
                            return { ...order, status: 'Preparing', new: false };
                        } else if (modalType === 'ready') {
                            return null;
                        }
                    }
                    return order;
                }).filter(Boolean) as Order[]
            );
        }
        closeModal();
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <div className="w-64 fixed top-0 left-0 h-screen">
                <ManagementSidebar activePath={pathname} />
            </div>

            <main className="flex-1 p-8 ml-64 min-h-screen">
                <h2 className="text-4xl font-bold mb-2">Objednávky</h2>
                <p className="text-gray-600 mb-8">Spravujte objednávky z jednoho místa.</p>

                <div className="bg-white p-6 rounded-3xl shadow-sm">
                    <table className="w-full text-left">
                        <thead className="sticky top-0 bg-white z-20">
                            <tr className="border-b">
                                <th className="p-4">ID</th>
                                <th className="p-4 w-1/3">Položky</th>
                                <th className="p-4">Datum a čas</th>
                                <th className="p-4">Kurýr</th>
                                <th className="p-4 text-right">Akce</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr
                                    key={order.id}
                                    className={`border-b hover:bg-gray-100 ${order.new ? 'bg-purple-50' : ''}`}
                                >
                                    <td className="p-4">#{order.id}</td>
                                    <td className="p-4">{order.items.join(', ')}</td>
                                    <td className="p-4">{order.orderDate} {order.orderTime}</td>
                                    <td className="p-4">{order.courier || 'Nepřiřazený'}</td>
                                    <td className="p-4 text-right">
                                        {order.status === 'Accepted' ? (
                                            <button
                                                onClick={() => openModal(order.id, 'accept')}
                                                className="w-56 px-4 py-2 bg-[var(--gradient-purple-start)] text-white rounded-2xl hover:bg-[var(--gradient-purple-end)]"
                                            >
                                                Přijmout objednávku
                                            </button>
                                        ) : order.status === 'Preparing' ? (
                                            <button
                                                onClick={() => openModal(order.id, 'ready')}
                                                className="w-56 px-4 py-2 bg-green-500 text-white rounded-2xl hover:bg-green-600"
                                            >
                                                Objednávka připravena
                                            </button>
                                        ) : null}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            <Modal isOpen={modalOrderId !== null} onClose={closeModal}>
                {modalType === 'accept' ? (
                    <>
                        <h2 className="text-xl font-semibold mb-4">Přijetí objednávky</h2>
                        <p className="text-gray-600 mb-3">Opravdu si přejete tuto objednávku přijmout a připravit na vyzvednutí kurýrem?</p>
                        <p className="text-red-600 mb-4">Tato akce nelze vrátit zpět!</p>
                    </>
                ) : modalType === 'ready' ? (
                    <>
                        <h2 className="text-xl font-semibold mb-4">Připraveno na vyzvednutí?</h2>
                        <p className="text-gray-600">Opravdu si přejete tuto objednávku přenechat kurýrovi pro vyzvednutí?</p>
                        <p className="text-gray-600 mb-3">Kurýr bude informován o připravené objednávce.</p>
                        <p className="text-red-600 mb-4">Tato akce nelze vrátit zpět!</p>
                    </>
                ) : null}
                <div className="flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 bg-gray-200 text-[var(--font)] rounded-md hover:bg-gray-300">
                        Zrušit
                    </button>
                    <button onClick={handleConfirmAction} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                        Potvrdit
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default ManagementOrders;
