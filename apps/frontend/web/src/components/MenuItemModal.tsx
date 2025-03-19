"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Modal from "@/components/Modal";
import { useShoppingCart } from "@/contexts/ShoppingCartContext";
import { toast, Slide } from 'react-toastify';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  restaurantId: string;
  imageUrl: string;
}

interface MenuItemModalProps {
  item: MenuItem;
  onClose: () => void;
}

export default function MenuItemModal({ item, onClose }: MenuItemModalProps) {
  const { cartItems, addToCart, clearOrder } = useShoppingCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [flyToCart, setFlyToCart] = useState(false);

  const isDifferentRestaurant =
    cartItems.length > 0 && cartItems[0].restaurantId !== item.restaurantId;

  const handleAddToCart = () => {
    if (isDifferentRestaurant) {
      setShowConfirmModal(true);
      return;
    }

    setFlyToCart(true);
    setTimeout(() => {
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
      setFlyToCart(false);
      onClose();
    }, 600);
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
        <motion.img
          src={item.imageUrl ? item.imageUrl : "/img/placeholder.png"}
          alt={item.name}
          className="w-full h-60 object-cover rounded-lg mb-4"
          animate={flyToCart ? { x: 450, y: -300, scale: 0.5, opacity: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
        <p className="text-gray-700 mb-4">{item.description}</p>
        <span className="block text-xl font-bold mb-6">Cena: {item.price} Kč</span>

        <button
          onClick={handleAddToCart}
          disabled={isSubmitting}
          className="w-full py-3 rounded-full bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white font-semibold transition-all"
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