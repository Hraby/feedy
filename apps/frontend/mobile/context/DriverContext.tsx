import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BACKEND_URL } from '@/lib/constants';
import { useAuth } from './AuthContext';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  orderId: string;
  menuItemId: string;
  menuItem: {
    name: string;
  };
}

interface Restaurant {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  address: {
    street: string;
    zipCode: string;
    city: string;
    country: string;
  };
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string[];
  address: {
    street: string;
    zipCode: string;
    city: string;
    country: string;
  };
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

interface DriverContextType {
  activeOrder: Order | null;
  activeOrderId: string | null;
  setActiveOrderId: (id: string | null) => void;
  fetchActiveOrder: () => Promise<void>;
  pickupOrder: () => Promise<void>;
  completeDelivery: () => Promise<void>;
}

const DriverContext = createContext<DriverContextType | undefined>(undefined);

export function DriverProvider({ children }: { children: ReactNode }) {
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const { accessToken } = useAuth();

  const fetchActiveOrder = async () => {
    if (!activeOrderId) {
      setActiveOrder(null);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/order/${activeOrderId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch active order');
      }

      const order = await response.json();
      setActiveOrder(order);
    } catch (error) {
      console.error('Error fetching active order:', error);
      setActiveOrder(null);
    }
  };

  const pickupOrder = async () => {
    if (!activeOrderId) return;

    try {
      const response = await fetch(`${BACKEND_URL}/order/${activeOrderId}/pickup`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to pickup order');
      }

      await fetchActiveOrder();
    } catch (error) {
      console.error('Error picking up order:', error);
    }
  };

  const completeDelivery = async () => {
    if (!activeOrderId) return;

    try {
      const response = await fetch(`${BACKEND_URL}/order/${activeOrderId}/deliver`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to complete delivery');
      }

      setActiveOrder(null);
      setActiveOrderId(null);
    } catch (error) {
      console.error('Error completing delivery:', error);
    }
  };

  return (
    <DriverContext.Provider
      value={{
        activeOrder,
        activeOrderId,
        setActiveOrderId,
        fetchActiveOrder,
        pickupOrder,
        completeDelivery
      }}
    >
      {children}
    </DriverContext.Provider>
  );
}

export function useDriver() {
  const context = useContext(DriverContext);
  if (!context) {
    throw new Error('useDriver must be used within a DriverProvider');
  }
  return context;
} 