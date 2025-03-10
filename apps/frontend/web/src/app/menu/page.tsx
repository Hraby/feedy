'use client';

import { useState } from "react";
import Link from "next/link";
import { FaClock, FaStar, FaUtensils } from "react-icons/fa";
import NavbarSwitcher from "@/components/NavbarSwitch";
import Footer from "@/components/Footer";

// only placeholder
const restaurants = [
    {
        name: "Kebab Haus Zlín",
        description: "Ochutnejte jedinečný kebab v centru Zlína.",
        category: "Kebab",
        deliveryTime: "25 min",
        rating: 4,
        image: "https://kebabstodulky.wordpress.com/wp-content/uploads/2024/08/img_2085-1.jpg"
    },
    {
        name: "KFC Zlín Zlaté Jablko",
        description: "Domov nejlepšího smaženého kuřete od roku 1952.",
        category: "Kuřecí",
        deliveryTime: "30 min",
        rating: 4,
        image: "https://kebabstodulky.wordpress.com/wp-content/uploads/2024/08/img_2085-1.jpg"
    },
    {
        name: "Mr Grill",
        description: "Hovězí burgery, kuřecí kebaby, vegetariánská kuchyně.",
        category: "Burger",
        deliveryTime: "35 min",
        rating: 4,
        image: "https://kebabstodulky.wordpress.com/wp-content/uploads/2024/08/img_2085-1.jpg"
    }
];

export default function Menu() {
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    const toggleFilter = (name: string) => {
        setSelectedFilters((prev: string[]) =>
            prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
        );
    };

    return (
        <div>
            <NavbarSwitcher />
            <div className="container mx-auto px-4">
                <div className="overflow-x-auto sm:overflow-hidden">
                    <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-4 text-center">
                        {[
                            { name: "Burger", icon: "/img/icons/burger.png" },
                            { name: "Kuřecí", icon: "/img/icons/chicken.png" },
                            { name: "Pizza", icon: "/img/icons/pizza.png" },
                            { name: "Čína", icon: "/img/icons/ramen.png" },
                            { name: "Snídaně", icon: "/img/icons/sandwich.png" },
                            { name: "Sushi", icon: "/img/icons/sushi.png" },
                            { name: "Salát", icon: "/img/icons/carrot.png" },
                            { name: "Sladké", icon: "/img/icons/waffle.png" },
                            { name: "Slané", icon: "/img/icons/fries.png" }
                        ].map((category) => (
                            <button
                                key={category.name}
                                onClick={() => toggleFilter(category.name)}
                                className={`relative rounded-3xl p-4 text-lg bg-[var(--gray)] flex flex-col items-center transition-all duration-300 overflow-hidden group text-gray-700 min-w-[100px] ${
                                    selectedFilters.includes(category.name) ? "text-white font-semibold" : "hover:bg-gray-200"
                                }`}
                            >
                                <span
                                    className={`absolute inset-0 transition-opacity duration-500 bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] ${
                                        selectedFilters.includes(category.name) ? "opacity-100" : "opacity-0"
                                    }`}
                                />
                                <img
                                    src={category.icon}
                                    alt={category.name}
                                    className="w-16 h-16 mb-2 transition-transform duration-300 group-hover:scale-110 relative z-10"
                                />
                                <span className="relative z-10">{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="relative bg-gradient-to-r from-[#f5880b] to-[#fff45f] p-6 rounded-3xl flex flex-col justify-between shadow-xl text-white overflow-hidden md:flex-row">
                        <div className="w-2/3">
                            <h2 className="text-xl font-bold">Feedy spouští své služby!</h2>
                            <p className="text-base">Online objednávání jídla nebylo nikdy jednodušší.</p>
                            <button className="mt-4 bg-white text-[#f5880b] font-semibold py-2 px-4 rounded-lg w-fit transform transition-all duration-300 hover:scale-105">✔ To chci!</button>
                        </div>
                        <img
                            src="https://images.pexels.com/photos/248444/pexels-photo-248444.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="Promo"
                            className="absolute top-0 right-0 h-full w-1/3 object-cover rounded-r-2xl hidden md:block"
                        />
                    </div>
                    <div className="relative bg-gradient-to-r from-[#9D174D] to-[#F0ABFC] p-6 rounded-3xl flex flex-col justify-between shadow-xl text-white overflow-hidden md:flex-row">
                        <div className="w-2/3">
                            <h2 className="text-xl font-bold">Získejte 100 Kč na první objednávku!</h2>
                            <p className="text-base">Na první objednávku rozdáváme slevu až 100 Kč.</p>
                            <button className="mt-4 bg-white text-[#9D174D] font-semibold py-2 px-4 rounded-lg w-fit transform transition-all duration-300 hover:scale-105">✔ Jdu do toho!</button>
                        </div>
                        <img
                            src="https://images.pexels.com/photos/375467/pexels-photo-375467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="Promo"
                            className="absolute top-0 right-0 h-full w-1/3 object-cover rounded-r-2xl hidden md:block"
                        />
                    </div>
                </div>

                <h2 className="text-2xl font-bold mt-16">Doprava zdarma nad 500 Kč</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 mb-10">
                    {restaurants.map((restaurant, index) => (
                        <Link key={index} href={`/restaurant/${index}`}>
                            <div className="bg-white rounded-3xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                                <img src={restaurant.image} alt={restaurant.name} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                                    <p className="text-gray-600 text-sm">{restaurant.description}</p>
                                    <div className="flex justify-between items-center mt-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                                <FaUtensils /> {restaurant.category}
                                            </span>
                                            <span className="bg-yellow-200 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                                <FaClock /> {restaurant.deliveryTime}
                                            </span>
                                        </div>
                                        <span className="flex items-center gap-1 text-yellow-500 text-sm font-semibold">
                                            <FaStar /> {restaurant.rating}/5
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <h2 className="text-2xl font-bold mt-16">Oblíbené</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 mb-10">
                    {restaurants.map((restaurant, index) => (
                        <Link key={index} href={`/restaurant/${index}`}>
                            <div className="bg-white rounded-3xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                                <img src={restaurant.image} alt={restaurant.name} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                                    <p className="text-gray-600 text-sm">{restaurant.description}</p>
                                    <div className="flex justify-between items-center mt-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                                <FaUtensils /> {restaurant.category}
                                            </span>
                                            <span className="bg-yellow-200 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                                <FaClock /> {restaurant.deliveryTime}
                                            </span>
                                        </div>
                                        <span className="flex items-center gap-1 text-yellow-500 text-sm font-semibold">
                                            <FaStar /> {restaurant.rating}/5
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <Footer/>
        </div>
    );
}