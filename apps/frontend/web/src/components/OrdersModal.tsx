'use client';

import { useEffect, useState } from 'react';
import { BACKEND_URL } from "@/lib/constants";
import { useAuth } from '@/contexts/AuthProvider';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  imageUrl: string;
  category: string;
  restaurantId: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  orderId: string;
  menuItemId: string;
  menuItem: MenuItem;
}

interface Restaurant {
  id: string;
  name: string;
  description: string;
  phone: string;
  ownerId: string;
  status: string;
  category: string[];
  imageUrl: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string[];
}

interface Order {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  restaurantId: string;
  courierProfileId: string | null;
  userId: string;
  user: User;
  restaurant: Restaurant;
  CourierProfile: any | null;
  orderItems: OrderItem[];
}

const OrdersModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const { accessToken } = useAuth();

  useEffect(() => {
    if (isOpen) {
      loadOrders();
    }
  }, [isOpen]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/order/user/history?status=Delivered`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        console.warn(`Failed to fetch user orders: ${response.status}`);
        setOrders([]);
        return;
      }

      const data = await response.json();
      data.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('cs-CZ');
  };

  const getOrderItems = (orderItems: OrderItem[]) => {
    return orderItems.map(item => `${item.menuItem.name} (${item.quantity}x)`).join(', ');
  };

  const calculateTotalPrice = (orderItems: OrderItem[]) => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      Pending: 'Čeká na zpracování',
      Preparing: 'Připravuje se',
      Ready: 'Připraveno k vyzvednutí',
      CourierPickup: 'Kurýr přijíždí',
      OutForDelivery: 'Na cestě',
      Delivered: 'Doručeno',
      Cancelled: 'Zrušeno'
    };
    return statusMap[status] || status;
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Moje objednávky</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center p-6">
          <p>Nemáte žádné objednávky</p>
        </div>
      ) : (
        <div className="overflow-y-auto max-h-[70vh]">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-white z-20">
              <tr className="border-b">
                <th className="p-4">Položky</th>
                <th className="p-4">Datum</th>
                <th className="p-4">Restaurace</th>
                <th className="p-4">Stav</th>
                <th className="p-4">Cena</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-100">
                  <td className="p-4">{getOrderItems(order.orderItems)}</td>
                  <td className="p-4">{formatDate(order.createdAt)}</td>
                  <td className="p-4">{order.restaurant.name}</td>
                  <td className="p-4">{getStatusLabel(order.status)}</td>
                  <td className="p-4">{calculateTotalPrice(order.orderItems)} Kč</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default OrdersModal;