import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_URL } from "@/lib/constants";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
  image?: { uri: string };
};

type ShoppingCartContextType = {
  openCart: () => void;
  closeCart: () => void;
  getItemQuantity: (id: string) => number;
  increaseCartQuantity: (id: string) => void;
  decreaseCartQuantity: (id: string) => void;
  removeFromCart: (id: string) => void;
  addToCart: (item: CartItem) => void;
  cartQuantity: number;
  cartItems: CartItem[];
  orderStatus: string | null;
  setOrderStatus: (status: string) => void;
  checkOrderStatus: (orderId: string) => void;
  clearOrder: () => void;
  clearCart: () => void;
  isCartOpen: boolean;
};

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);

export const ShoppingCartProvider = ({ children }: { children: ReactNode }) => {
  const { accessToken } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);

  useEffect(() => {
    const loadCart = async () => {
      const savedCart = await AsyncStorage.getItem("cartItems");
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    };
    loadCart();
  }, []);

  useEffect(() => {
    const saveCart = async () => {
      await AsyncStorage.setItem("cartItems", JSON.stringify(cartItems));
    };
    saveCart();
  }, [cartItems]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const getItemQuantity = (id: string) => {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      if (prev.length === 0 || prev[0].restaurantId === item.restaurantId) {
        const existingItem = prev.find((cartItem) => cartItem.id === item.id);
        if (existingItem) {
          return prev.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
              : cartItem
          );
        }
        return [...prev, item];
      }
      return [item];
    });
  };

  const increaseCartQuantity = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseCartQuantity = (id: string) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const checkOrderStatus = async (orderId: string) => {
    try {
      console.log("Checking order status for ID:", orderId);
      const response = await fetch(`${BACKEND_URL}/order/${orderId}/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      });
      
      if (!response.ok) throw new Error("Chyba při načítání stavu objednávky");
      const data = await response.json();
      console.log("Order status response:", data);
      setOrderStatus(data.status);
    } catch (error) {
      console.error("Error checking order status:", error);
      setOrderStatus("Chyba");
    }
  };

  const clearOrder = () => {
    setCartItems([]);
    setOrderStatus(null);
  };

  const cartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ShoppingCartContext.Provider
      value={{
        openCart,
        closeCart,
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        addToCart,
        cartQuantity,
        cartItems,
        orderStatus,
        setOrderStatus,
        checkOrderStatus,
        clearOrder,
        clearCart,
        isCartOpen,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};

export const useShoppingCart = () => {
  const context = useContext(ShoppingCartContext);
  if (!context) {
    throw new Error("useShoppingCart must be used within a ShoppingCartProvider");
  }
  return context;
};