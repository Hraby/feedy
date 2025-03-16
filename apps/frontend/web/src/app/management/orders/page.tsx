'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Modal from '@/components/Modal';
import ManagementSidebar from '@/components/ManagementSidebar';
import { Slide, ToastContainer, toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthProvider';
import { approveOrder, getOrdersRestaurant, markOrderReady } from '@/app/actions/adminAction';

interface Order {
    id: string;
    items: string[];
    status: 'Pending' | 'Preparing' | 'Ready'  | 'OutForDelivery' | 'Delivered' | 'Cancelled';
    orderDate: string;
    orderTime: string;
    restaurantName: string;
    courier: string | null;
    new: boolean;
}

const ManagementOrders = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [orders, setOrders] = useState<Order[]>([]);
    const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    
    const [readyConfirmation, setReadyConfirmation] = useState<{
        orderId: string;
        items: string[];
        visible: boolean;
    } | null>(null);

    const { accessToken } = useAuth();
    const restaurantId = searchParams.get("restaurantId");

    const [modalOrderId, setModalOrderId] = useState<string | null>(null);
    const [modalType, setModalType] = useState<'accept' | 'ready' | null>(null);

    const openModal = (id: string, type: 'accept' | 'ready') => {
        setModalOrderId(id);
        setModalType(type);
    };

    const closeModal = () => {
        setModalOrderId(null);
        setModalType(null);
    };

    const fetchOrdersRestaurant = async () => {
        if (!accessToken || !restaurantId || isLoading) return;
        
        setIsLoading(true);
        try {
            const ordersData = await getOrdersRestaurant(accessToken, restaurantId);
            
            if (orders.length > 0) {
                const currentOrderIds = new Set(orders.map(order => order.id));
                const newOrders = ordersData.filter((order: any) => !currentOrderIds.has(order.id));
                
                if (newOrders.length > 0) {
                    toast.info(`Nová objednávka! Celkem nových objednávek: ${newOrders.length}`);
                }
            }
            
            setOrders(ordersData);
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Nepodařilo se načíst objednávky:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!accessToken || !restaurantId) return;
        
        fetchOrdersRestaurant();
        
        const POLLING_INTERVAL = 15000;
        pollingIntervalRef.current = setInterval(fetchOrdersRestaurant, POLLING_INTERVAL);
        
        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, [accessToken, restaurantId]);

    const handleConfirmAction = async () => {
        if (modalOrderId !== null && accessToken && restaurantId) {          
          try {
            if (modalType === 'accept') {
              await approveOrder(accessToken, modalOrderId);
              
              setOrders((prevOrders) =>
                prevOrders.map((order) => {
                  if (order.id === modalOrderId) {
                    return { ...order, status: 'Preparing', new: false };
                  }
                  return order;
                })
              );
              toast.success("Objednávka byla úspěšně přijata!");
            } else if (modalType === 'ready') {
              await markOrderReady(accessToken, modalOrderId);
              
                const orderToRemove = orders.find(order => order.id === modalOrderId);

                if (orderToRemove) {
                    const completedOrder = { 
                        ...orderToRemove, 
                        status: 'OutForDelivery' as Order['status'] 
                    };
                setCompletedOrders(prev => [completedOrder, ...prev]);
                
                
                setReadyConfirmation({
                  orderId: orderToRemove.id,
                  items: orderToRemove.items,
                  visible: true
                });
                
                setTimeout(() => {
                  setReadyConfirmation(prev => prev && prev.orderId === modalOrderId ? { ...prev, visible: false } : prev);
                }, 5000);
              }
              
              setOrders((prevOrders) =>
                prevOrders.filter((order) => order.id !== modalOrderId) as Order[]
              );
            }
            
            setTimeout(fetchOrdersRestaurant, 1000);
            
          } catch (err) {
            console.error(err);
            toast.error("Došlo k chybě při zpracování objednávky.");
          } finally {
            closeModal();
          }
        }
    };

    const getStatusBadge = (status: Order['status']) => {
        switch (status) {
            case 'Pending':
                return { color: 'bg-yellow-100 text-yellow-800', text: 'Čeká na zpracování' };
            case 'Preparing':
                return { color: 'bg-blue-100 text-blue-800', text: 'Připravuje se' };
            case 'Ready':
                return { color: 'bg-green-100 text-green-800', text: 'Připraveno k vyzvednutí' };
            case 'OutForDelivery':
                return { color: 'bg-purple-100 text-purple-800', text: 'Na cestě' };
            case 'Delivered':
                return { color: 'bg-green-100 text-green-800', text: 'Doručeno' };
            case 'Cancelled':
                return { color: 'bg-red-100 text-red-800', text: 'Zrušeno' };
            default:
                return { color: 'bg-gray-100 text-gray-800', text: status };
        }
    };

    const getTimeSinceLastUpdate = () => {
        if (!lastUpdated) return "Nikdy";
        
        const now = new Date();
        const diffSeconds = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);
        
        if (diffSeconds < 60) {
            return `před ${diffSeconds} s`;
        } else {
            const diffMinutes = Math.floor(diffSeconds / 60);
            return `před ${diffMinutes} min`;
        }
    };

    const handleManualRefresh = () => {
        fetchOrdersRestaurant();
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <div className="w-64 fixed top-0 left-0 h-screen">
                <ManagementSidebar activePath={pathname} />
            </div>

            <main className="flex-1 p-8 ml-64 min-h-screen">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-4xl font-bold">Objednávky</h2>
                    <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">
                            Poslední aktualizace: {getTimeSinceLastUpdate()}
                        </span>
                        <button 
                            onClick={handleManualRefresh}
                            disabled={isLoading}
                            className="flex items-center px-3 py-1 bg-white text-gray-700 rounded-md hover:bg-gray-100 border border-gray-300"
                        >
                            <svg 
                                className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            {isLoading ? 'Načítání...' : 'Obnovit'}
                        </button>
                    </div>
                </div>
                <p className="text-gray-600 mb-8">Spravujte objednávky z jednoho místa. Automatická aktualizace každých 15 sekund.</p>

                <div className="bg-white p-6 rounded-3xl shadow-sm mb-8">
                    <h3 className="text-xl font-semibold mb-4">Aktivní objednávky</h3>
                    {isLoading && orders.length === 0 ? (
                        <div className="flex justify-center items-center py-12">
                            <svg className="animate-spin h-8 w-8 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="ml-3 text-gray-600">Načítání objednávek...</span>
                        </div>
                    ) : orders.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="sticky top-0 bg-white z-20">
                                <tr className="border-b">
                                    <th className="p-4">ID</th>
                                    <th className="p-4 w-1/3">Položky</th>
                                    <th className="p-4">Datum a čas</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Akce</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => {
                                    const statusBadge = getStatusBadge(order.status);
                                    return (
                                        <tr
                                            key={order.id}
                                            className={`border-b hover:bg-gray-100 ${order.new ? 'bg-purple-50' : ''}`}
                                        >
                                            <td className="p-4">{order.id}</td>
                                            <td className="p-4">{order.items.join(', ')}</td>
                                            <td className="p-4">{order.orderDate} {order.orderTime}</td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.color}`}>
                                                    {statusBadge.text}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                {order.status === 'Pending' ? (
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
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <svg className="h-16 w-16 text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-700">Žádné aktivní objednávky</h3>
                            <p className="mt-1 text-sm text-gray-500">Momentálně nemáte žádné objednávky ke zpracování.</p>
                        </div>
                    )}
                </div>
            </main>

            <ToastContainer/>

            <Modal isOpen={modalOrderId !== null} onClose={closeModal}>
                {modalType === 'accept' ? (
                    <>
                        <h2 className="text-xl font-semibold mb-4">Přijetí objednávky</h2>
                        <p className="text-gray-600 mb-3">Opravdu si přejete tuto objednávku přijmout a připravit na vyzvednutí kurýrem?</p>
                        <p className="text-red-600 mb-4">Tato akce nelze vrátit zpět!</p>
                    </>
                ) : modalType === 'ready' ? (
                    <>
                        <h2 className="text-xl font-semibold mb-4">Dokončit objednávku?</h2>
                        <p className="text-gray-600">Opravdu si přejete označit tuto objednávku jako dokončenou?</p>
                        <p className="text-gray-600 mb-3">Objednávka bude přesunuta do dokončených objednávek.</p>
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