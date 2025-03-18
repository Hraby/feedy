"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaClock, FaStar, FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";
import NavbarSwitcher from "@/components/NavbarSwitch";
import ItemModal from "@/components/MenuItemModal";
import { fetchRestaurantId } from "@/app/actions/adminAction";
import { useAuth } from "@/contexts/AuthProvider";
import { notFound } from "next/navigation";
import { ToastContainer } from 'react-toastify';
import Link from "next/link";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  available: boolean;
  restaurantId: string;
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
                <span className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-600 rounded-full">
                  <FaClock /> 30 min
                </span>
                <span className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                  <FaMoneyBillWave /> 34 Kč za dopravu
                </span>
              </div>
            </div>

            <div className="mt-16">
              {restaurant.menuItems.length > 0 ? (
                Object.entries(
                  restaurant.menuItems.reduce<Record<string, MenuItem[]>>((groups, item) => {
                    const category = item.category || "Ostatní";
                    if (!groups[category]) {
                      groups[category] = [];
                    }
                    groups[category].push(item);
                    return groups;
                  }, {})
                ).map(([category, items]) => (
                  <div key={category} className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 border-b pb-2">{category}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                      {items.map((item, index) => (
                        <div
                          key={index}
                          onClick={() => item.available ? setSelectedItem(item) : null}
                          className={`bg-white rounded-3xl shadow-lg overflow-hidden ${item.available ? 'cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl' : 'opacity-70'} flex flex-col relative`}
                        >
                          {!item.available && (
                            <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-10 cursor-not-allowed">
                              <div className="bg-red-500 text-white py-1 px-4 rounded-full font-medium transform -rotate-12">
                                Momentálně nedostupné
                              </div>
                            </div>
                          )}
                          <img src={item.imageUrl || "/img/burger.png"} alt={item.name} className="w-full h-48 object-cover" />
                          <div className="flex flex-col justify-between p-4 flex-grow">
                            <div>
                              <h3 className="text-lg font-semibold">{item.name}</h3>
                              <p className="text-gray-600 text-sm">{item.description}</p>
                            </div>
                            <span className="block mt-2 text-xl text-center font-bold text-[var(--primary)]">
                              {item.price} Kč
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-center flex-col items-center h-96">
                  <p className="text-gray-500 text-xl">Tato restaurace zatím nemá žádné položky v menu.</p>
                </div>
              )}
            </div>
            {selectedItem && <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
          </div>
        )
      )}
      <Link href="/checkout">
        <ToastContainer/>
      </Link>
    </div>
  );
}