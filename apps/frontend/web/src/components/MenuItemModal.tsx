import { useState } from "react";
import Modal from "@/components/Modal";

interface MenuItem {
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  options?: { label: string; checked: boolean }[];
}

interface MenuItemModalProps {
  item: MenuItem;
  onClose: () => void;
}

export default function MenuItemModal({ item, onClose }: MenuItemModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [options, setOptions] = useState(item.options || []);

  const handleAddToCart = async () => {
    try {
      setIsSubmitting(true);
      const payload = { ...item, options };

      // TODO: Odeslat na backend
      /*
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      */

      alert("Položka přidána do košíku!");
      onClose();
    } catch (error) {
      alert("Chyba při přidávání do košíku.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOptionChange = (index: number) => {
    setOptions((prev) =>
      prev.map((option, i) =>
        i === index ? { ...option, checked: !option.checked } : option
      )
    );
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">{item.name}</h2>
      <img
        src={item.imageUrl}
        alt={item.name}
        className="w-full h-60 object-cover rounded-lg mb-4"
      />
      <p className="text-gray-700 mb-4">{item.description}</p>
      <span className="block text-xl font-bold mb-6">Cena: {item.price} Kč</span>

      {options.length > 0 && (
        <div className="mb-6 space-y-2">
          <h3 className="text-lg font-semibold">Možnosti:</h3>
          {options.map((option, index) => (
            <label key={index} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={option.checked}
                onChange={() => handleOptionChange(index)}
                className="w-5 h-5"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      )}

      <button
        onClick={handleAddToCart}
        disabled={isSubmitting}
        className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-orange-600 transition-all duration-300 active:scale-95"
      >
        {isSubmitting ? "Přidávám..." : "Přidat do košíku"}
      </button>
    </Modal>
  );
}