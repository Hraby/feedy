"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaClock, FaStar, FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";
import NavbarSwitcher from "@/components/NavbarSwitch";
import ItemModal from "@/components/MenuItemModal";
import { fetchRestaurantId } from "@/app/actions/adminAction";
import { useAuth } from "@/contexts/AuthProvider";
import { notFound } from "next/navigation";

interface MenuItem {
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

interface Restaurant {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  menuItems: MenuItem[];
}

export default function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const { accessToken } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) return;
      try {
        const data = await fetchRestaurantId(id as string, accessToken);
        setRestaurant(data);
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, accessToken]);

  return (
    <div>
      <NavbarSwitcher />

      {loading ? (
        <div className="container mx-auto px-4 animate-pulse">
          <div className="w-full h-44 bg-gray-200 rounded-3xl"></div>

          <div className="mt-6">
            <div className="w-1/2 h-6 bg-gray-200 rounded-md mb-2"></div>
            <div className="w-3/4 h-4 bg-gray-200 rounded-md"></div>
          </div>

          <h2 className="text-2xl font-bold mt-16">Menu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4 mb-10">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg overflow-hidden">
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="w-3/4 h-5 bg-gray-200 rounded-md mb-2"></div>
                  <div className="w-full h-4 bg-gray-200 rounded-md"></div>
                  <div className="w-1/3 h-5 bg-gray-200 rounded-md mt-2 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        !restaurant ? notFound() : (
          <div className="container mx-auto px-4">
            <div className="relative">
              <img
                src={restaurant.imageUrl}
                alt={restaurant.name}
                className="w-full h-44 object-cover rounded-3xl"
              />
            </div>

            <div className="mt-6">
              <h1 className="text-2xl font-bold">{restaurant.name}</h1>
              <p className="text-gray-600">{restaurant.description}</p>

              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-600 rounded-full">
                  <FaCheckCircle /> Otevřeno
                </span>
                <span className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full">
                  <FaStar /> 4.5/5
                </span>
                <span className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-600 rounded-full">
                  <FaClock /> 25 min
                </span>
                <span className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                  <FaMoneyBillWave /> 16 Kč za dopravu
                </span>
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-16">Menu</h2>

            {restaurant.menuItems.length > 0 ? (
              restaurant.menuItems.map((item, index) => (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4 mb-10">
                  <div
                    key={index}
                    onClick={() => setSelectedItem(item)}
                    className="bg-white rounded-3xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                      <span className="block mt-2 text-xl text-center font-bold text-[var(--primary)]">
                        {item.price} Kč
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center flex-col items-center h-96">
                <p className="text-gray-500 text-xl">Tato restaurace zatím nemá žádné položky v menu.</p>
              </div>
            )}
            {selectedItem && <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
          </div>
        )
      )}
    </div>
  );
}
