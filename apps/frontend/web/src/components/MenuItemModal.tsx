"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import { useShoppingCart } from "@/contexts/ShoppingCartContext";
import { toast, Slide } from 'react-toastify';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  restaurantId: string;
}

interface MenuItemModalProps {
  item: MenuItem;
  onClose: () => void;
}

export default function MenuItemModal({ item, onClose }: MenuItemModalProps) {
  const { cartItems, addToCart, clearOrder } = useShoppingCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const isDifferentRestaurant =
    cartItems.length > 0 && cartItems[0].restaurantId !== item.restaurantId;

  const handleAddToCart = () => {
    if (isDifferentRestaurant) {
      setShowConfirmModal(true);
      return;
    }

    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      restaurantId: item.restaurantId,
    });

    toast.success(`Položka ${item.name} byla přidána do košíku!`, {
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

    onClose();
  };

  const confirmChangeRestaurant = () => {
    clearOrder();
    handleAddToCart();
    setShowConfirmModal(false);
  };

  const handleMainModalClose = () => {
    if (!showConfirmModal) {
      onClose();
    }
  };

  return (
    <>
      <Modal isOpen={true} onClose={handleMainModalClose}>
        <h2 className="text-2xl font-bold mb-4">{item.name}</h2>
        <img
          src="/img/burger.png"
          alt={item.name}
          className="w-full h-60 object-cover rounded-lg mb-4"
        />
        <p className="text-gray-700 mb-4">{item.description}</p>
        <span className="block text-xl font-bold mb-6">Cena: {item.price} Kč</span>

        <button
          onClick={handleAddToCart}
          disabled={isSubmitting}
          className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-orange-600 transition-all duration-300 active:scale-95"
        >
          {isSubmitting ? "Přidávám..." : "Přidat do košíku"}
        </button>
      </Modal>

      {showConfirmModal && (
        <Modal isOpen={true} onClose={() => setShowConfirmModal(false)}>
          <h2 className="text-xl font-bold mb-4">Změna restaurace</h2>
          <p className="text-gray-700 mb-4">
            Máte v košíku položky z jiné restaurace. Chcete vymazat košík a přidat tuto položku?
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="flex-1 py-3 rounded-xl bg-gray-300 text-black font-semibold hover:bg-gray-400 transition-all"
            >
              Ne, ponechat
            </button>
            <button
              onClick={confirmChangeRestaurant}
              className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all"
            >
              Ano, vymazat košík
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}