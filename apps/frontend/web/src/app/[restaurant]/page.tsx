"use client";

import { useState } from "react";
import { FaClock, FaStar, FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";
import NavbarSwitcher from "@/components/NavbarSwitch";
import ItemModal from "@/components/MenuItemModal";
import Navbar from "@/components/Navbar";

interface MenuItem {
  name: string;
  price: number;
  description: string;
  image: string;
}

export default function RestaurantDetail() {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const restaurantDetail = {
    name: "Kebab Haus Zlín",
    description: "Ochutnejte jedinečný kebab v centru Zlína.",
    rating: 4.5,
    deliveryTime: 25,
    deliveryPrice: 16,
    isOpen: true,
    menu: [
      {
        name: "Döner klasický",
        price: 135,
        description: "Maso, turecký chléb, zelí, dresink",
        image: "https://cdn.myshoptet.com/usr/www.svacazkola.cz/user/shop/big/11961-1_mega-doner-kebab-se-syrem.png",
      },
      {
        name: "Döner se sýrem",
        price: 155,
        description: "Maso, turecký chléb, sýr, zelí, dresink",
        image: "https://cdn.myshoptet.com/usr/www.svacazkola.cz/user/shop/big/11961-1_mega-doner-kebab-se-syrem.png",
      },
    ],
  };

  return (
    <div>
      <Navbar></Navbar>
      <div className="container mx-auto px-4">
        <div className="relative">
          <img
            src="https://kebabstodulky.wordpress.com/wp-content/uploads/2024/08/img_2085-1.jpg"
            alt={restaurantDetail.name}
            className="w-full h-44 object-cover rounded-3xl"
          />
        </div>

        <div className="mt-6">
          <h1 className="text-2xl font-bold">{restaurantDetail.name}</h1>
          <p className="text-gray-600">{restaurantDetail.description}</p>

          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-600 rounded-full">
              <FaCheckCircle /> {restaurantDetail.isOpen ? "Otevřeno" : "Zavřeno"}
            </span>
            <span className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full">
              <FaStar /> {restaurantDetail.rating}/5
            </span>
            <span className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-600 rounded-full">
              <FaClock /> {restaurantDetail.deliveryTime} min
            </span>
            <span className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
              <FaMoneyBillWave /> {restaurantDetail.deliveryPrice} Kč za dopravu
            </span>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-16">Döner kebab</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4 mb-10">
          {restaurantDetail.menu.map((item, index) => (
            <div
              key={index}
              onClick={() => setSelectedItem(item)}
              className="bg-white rounded-3xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
                <span className="block mt-2 text-xl text-center font-bold text-[var(--primary)]">
                  {item.price} Kč
                </span>
              </div>
            </div>
          ))}
        </div>

        {selectedItem && (
          <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </div>
    </div>
  );
}
