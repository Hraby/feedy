'use client';

import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { useState, useEffect } from 'react';
import { FaTrash, FaCog } from 'react-icons/fa';
import Modal from '@/components/Modal';
import { toast, Slide } from 'react-toastify';
import { useAuth } from '@/contexts/AuthProvider';
import { BACKEND_URL } from '@/lib/constants';

export interface AdminSidebarProps {
    activePath: string;
}

enum OrderStatus {
    Pending = "Pending",
    Preparing = "Preparing",
    Ready = "Ready",
    CourierPickup = "CourierPickup",
    OutForDelivery = "OutForDelivery",
    Delivered = "Delivered",
    Cancelled = "Cancelled"
}

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    menuItem: {
        id: string;
        name: string;
        description: string;
        price: number;
        category: string;
    };
}

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface Restaurant {
    id: string;
    name: string;
    phone: string;
}

interface CourierProfile {
    id: string;
    userId: string;
    city: string;
    vehicle: string;
    language: string;
    status: string;
    approvalStatus: string;
    dateBirth: string;
    createdAt: string;
    updatedAt: string;
}

interface CourierUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface Order {
    id: string;
    status: OrderStatus;
    createdAt: string;
    updatedAt: string;
    userId: string;
    restaurantId: string;
    courierProfileId: string | null;
    user: User;
    restaurant: Restaurant;
    CourierProfile: CourierProfile | null;
    orderItems: OrderItem[];
}

const statusColors = {
    [OrderStatus.Pending]: 'bg-gray-500',
    [OrderStatus.Preparing]: 'bg-yellow-500',
    [OrderStatus.Ready]: 'bg-blue-500',
    [OrderStatus.CourierPickup]: 'bg-orange-500',
    [OrderStatus.OutForDelivery]: 'bg-purple-500',
    [OrderStatus.Delivered]: 'bg-green-500',
    [OrderStatus.Cancelled]: 'bg-red-500'
};

const statuses = Object.values(OrderStatus);

const AdminOrders = () => {
    const pathname = usePathname();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
    const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [courierUsers, setCourierUsers] = useState<Record<string, CourierUser>>({});  
    const { accessToken } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                
                console.log(accessToken);
    
                if (accessToken) {
                    const response = await fetch(`${BACKEND_URL}/order`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${accessToken}`,
                        },
                    });
                    
                    if (!response.ok) {
                        throw new Error(`Chyba při načítání objednávek: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    setOrders(data);
                    setLoading(false);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Nastala neznámá chyba');
                toast.error('Nepodařilo se načíst objednávky', {
                    position: "bottom-right",
                    theme: "colored",
                });
                setLoading(false);
            }
        };
        
        if (accessToken) {
            fetchOrders();
        }
    }, [accessToken]);

    useEffect(() => {
        const fetchCourierUsers = async () => {
            if (!accessToken) return;
            
            const courierUserIds = orders
                .filter(order => order.CourierProfile !== null)
                .map(order => order.CourierProfile?.userId)
                .filter((userId, index, self) => userId && self.indexOf(userId) === index) as string[];
            
            if (courierUserIds.length === 0) return;
            
            const userDataPromises = courierUserIds.map(async (userId) => {
                try {
                    const response = await fetch(`${BACKEND_URL}/user/${userId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${accessToken}`,
                        },
                    });
                    
                    if (!response.ok) {
                        throw new Error(`Chyba při načítání uživatele: ${response.status}`);
                    }
                    
                    return await response.json();
                } catch (error) {
                    console.error(`Chyba při načítání uživatele ${userId}:`, error);
                    return null;
                }
            });
            
            const results = await Promise.all(userDataPromises);
            const userMap: Record<string, CourierUser> = {};
            
            results.forEach((userData, index) => {
                if (userData) {
                    userMap[courierUserIds[index]] = userData;
                }
            });
            
            setCourierUsers(userMap);
        };
        
        if (orders.length > 0) {
            fetchCourierUsers();
        }
    }, [orders, accessToken]);

    

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if ((event.target as HTMLElement).closest('.dropdown') === null) {
                setEditingOrderId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleStatusChange = async (id: string, status: OrderStatus) => {
        try {
            if (!accessToken) {
                throw new Error('Není k dispozici přístupový token');
            }
            
            let endpoint = '';
            switch (status) {
                case OrderStatus.Preparing:
                    endpoint = `/order/${id}/prepare`;
                    break;
                case OrderStatus.Ready:
                    endpoint = `/order/${id}/ready`;
                    break;
                case OrderStatus.CourierPickup:
                    endpoint = `/order/${id}/claim`;
                    break;
                case OrderStatus.OutForDelivery:
                    endpoint = `/order/${id}/pickup`;
                    break;
                case OrderStatus.Delivered:
                    endpoint = `/order/${id}/deliver`;
                    break;
                case OrderStatus.Cancelled:
                    endpoint = `/order/${id}/cancel`;
                    break;
                default:
                    throw new Error(`Nepodporovaný stav objednávky: ${status}`);
            }
            
            const response = await fetch(`${BACKEND_URL}${endpoint}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                }
            });
            
            if (!response.ok) {
                throw new Error(`Chyba při aktualizaci stavu: ${response.status}`);
            }
            
            setOrders(orders.map(order => (
                order.id === id ? { ...order, status } : order
            )));
            
            setEditingOrderId(null);
            
            toast.success(`Stav objednávky byl upraven!`, {
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
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Nepodařilo se aktualizovat stav objednávky', {
                position: "bottom-right",
                theme: "colored",
            });
        }
    };

    const handleDeleteOrder = (id: string) => {
        setDeleteOrderId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteOrder = async () => {
        if (deleteOrderId !== null) {
            try {
                if (!accessToken) {
                    throw new Error('Není k dispozici přístupový token');
                }
                
                const response = await fetch(`${BACKEND_URL}/order/${deleteOrderId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    }
                });

                console.log(response.json())
                
                if (!response.ok) {
                    throw new Error(`Chyba při mazání objednávky: ${response.status}`);
                }
                
                setOrders(orders.filter(order => order.id !== deleteOrderId));
                
                toast.success(`Objednávka byla smazána z databáze!`, {
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
            } catch (err) {
                toast.error(err instanceof Error ? err.message : 'Nepodařilo se smazat objednávku', {
                    position: "bottom-right",
                    theme: "colored",
                });
            } finally {
                setDeleteOrderId(null);
                setIsDeleteModalOpen(false);
            }
        }
    };

    const cancelDeleteOrder = () => {
        setDeleteOrderId(null);
        setIsDeleteModalOpen(false);
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('cs-CZ'),
            time: date.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })
        };
    };

    const getOrderItemNames = (orderItems: OrderItem[]) => {
        return orderItems.map(item => `${item.quantity}x ${item.menuItem.name}`).join(', ');
    };

    const getOrderTotal = (orderItems: OrderItem[]) => {
        return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCourierName = (courierProfile: CourierProfile | null) => {
        if (!courierProfile) return 'Nepřiřazený';
        
        const user = courierUsers[courierProfile.userId];
        if (!user) return `Kurýr (ID: ${courierProfile.userId.substring(0, 8)}...)`;
        
        return `${user.firstName} ${user.lastName}`;
    };

    const availableStatuses = Object.values(OrderStatus).filter(
        status => status !== OrderStatus.Pending
    );
      

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <div className="w-64 fixed top-0 left-0 h-screen">
                <AdminSidebar activePath={pathname} />
            </div>

            <main className="flex-1 p-8 ml-64 min-h-screen">
                <h2 className="text-4xl font-bold mb-2">Správa objednávek</h2>
                <p className="text-gray-600 mb-8">Spravujte objednávky z jednoho místa.</p>

                {loading ? (
                    <div className="bg-white p-6 rounded-3xl shadow-sm flex justify-center items-center h-64">
                        <p className="text-gray-500">Načítání objednávek...</p>
                    </div>
                ) : error ? (
                    <div className="bg-white p-6 rounded-3xl shadow-sm">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white p-6 rounded-3xl shadow-sm flex justify-center items-center h-64">
                        <p className="text-gray-500">Žádné objednávky k zobrazení</p>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-3xl shadow-sm">
                        <table className="w-full text-left">
                            <thead className="sticky top-0 bg-white z-20">
                                <tr className="border-b">
                                    <th className="p-4">ID</th>
                                    <th className="p-4 w-1/6">Položky</th>
                                    <th className="p-4">Cena</th>
                                    <th className="p-4 w-1/6">Stav</th>
                                    <th className="p-4">Datum a čas</th>
                                    <th className="p-4">Restaurace</th>
                                    <th className="p-4">Kurýr</th>
                                    <th className="p-4 text-right">Akce</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => {
                                    const { date, time } = formatDateTime(order.createdAt);
                                    return (
                                        <tr key={order.id} className="border-b hover:bg-gray-100">
                                            <td className="p-4">{order.id.substring(0, 8)}</td>
                                            <td className="p-4">{getOrderItemNames(order.orderItems)}</td>
                                            <td className="p-4">{getOrderTotal(order.orderItems)} Kč</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-xl text-white ${statusColors[order.status]}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-4">{date} {time}</td>
                                            <td className="p-4">{order.restaurant.name}</td>
                                            <td className="p-4">{getCourierName(order.CourierProfile)}</td>
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
                                                    className="text-gray-700 group pt-2"
                                                >
                                                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 transition-colors group-hover:bg-red-600">
                                                        <FaTrash size={20} className="text-gray-700 group-hover:text-white" />
                                                    </div>
                                                </button>

                                                {editingOrderId === order.id && (
                                                    <div className="dropdown absolute right-0 w-60 mt-2 bg-white border p-4 rounded-xl shadow-lg z-10">
                                                        <h4 className="text-lg text-center font-semibold mb-4">Změnit status</h4>
                                                        {availableStatuses.map((status) => (
                                                            <label key={status} className="flex items-center gap-3 mb-2 cursor-pointer">
                                                                <input
                                                                    type="radio"
                                                                    value={status}
                                                                    checked={order.status === status}
                                                                    onChange={() => handleStatusChange(order.id, status as OrderStatus)}
                                                                    className="w-5 h-5 rounded-2xl accent-[var(--primary)]"
                                                                />
                                                                <span>{status}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            <Modal isOpen={isDeleteModalOpen} onClose={cancelDeleteOrder}>
                <h2 className="text-lg font-semibold mb-2">Odstranit objednávku</h2>
                <p className="text-gray-600">Opravdu chcete odstranit tuto objednávku?</p>
                <p className="text-red-600 mb-4">Tato akce nelze vrátit zpět!</p>
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