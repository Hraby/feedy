'use client';

import { useEffect, useState } from 'react';
import { BACKEND_URL } from "@/lib/constants";
import { useAuth } from '@/contexts/AuthProvider';
import { FaCalendar, FaClock } from 'react-icons/fa';

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

interface Order {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  restaurantId: string;
  courierProfileId: string | null;
  userId: string;
  orderItems: OrderItem[];
}

interface SpendingStats {
  totalSpending: number;
  thisMonthSpending: number;
  averageOrderAmount: number;
}

const BalanceModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [stats, setStats] = useState<SpendingStats>({
    totalSpending: 0,
    thisMonthSpending: 0,
    averageOrderAmount: 0
  });
  const [loading, setLoading] = useState(false);
  const { accessToken } = useAuth();

  useEffect(() => {
    if (isOpen) {
      loadSpendingStats();
    }
  }, [isOpen]);

  const calculateTotalPrice = (orderItems: OrderItem[]): number => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const loadSpendingStats = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${BACKEND_URL}/order/user/history?status=Delivered`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        console.warn(`Failed to fetch user orders: ${response.status}`);
        return;
      }

      const orders: Order[] = await response.json();
      
      if (orders.length === 0) {
        setStats({
          totalSpending: 0,
          thisMonthSpending: 0,
          averageOrderAmount: 0
        });
        return;
      }

      const totalSpending = orders.reduce((total, order) => 
        total + calculateTotalPrice(order.orderItems), 0);
      
      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();
      
      const thisMonthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === thisMonth && orderDate.getFullYear() === thisYear;
      });
      
      const thisMonthSpending = thisMonthOrders.reduce((total, order) => 
        total + calculateTotalPrice(order.orderItems), 0);
      
      const averageOrderAmount = totalSpending / orders.length;

      setStats({
        totalSpending,
        thisMonthSpending,
        averageOrderAmount
      });
    } catch (error) {
      console.error('Error loading spending stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number): string => {
    return price.toFixed(2) + " Kč";
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Útraty</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
        </div>
      ) : (
        <>
          <div className="mt-6 bg-gray-50 p-6 rounded-2xl space-y-4">
            <div className="text-center">
              <p className="text-sm mb-2">Celkové útraty</p>
              <h2 className="text-4xl font-semibold">{formatPrice(stats.totalSpending)}</h2>
            </div>
          </div>
          <div className="max-w-6xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="mt-6 bg-gray-50 p-6 rounded-2xl space-y-4">
              <div className="text-center">
                <div className="flex justify-center">
                  <FaCalendar className="text-[var(--primary)] text-3xl" />
                </div>
                <p className="text-sm mt-3 mb-1">Tento měsíc</p>
                <h2 className="text-2xl font-semibold">{formatPrice(stats.thisMonthSpending)}</h2>
              </div>
            </div>
            <div className="mt-6 bg-gray-50 p-6 rounded-2xl space-y-4">
              <div className="text-center">
                <div className="flex justify-center">
                  <FaClock className="text-[var(--primary)] text-3xl" />
                </div>
                <p className="text-sm mt-3 mb-1">Průměrná objednávka</p>
                <h2 className="text-2xl font-semibold">{formatPrice(stats.averageOrderAmount)}</h2>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default BalanceModal;