'use client';

import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Menu() {
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    const toggleFilter = (name: string) => {
        setSelectedFilters((prev: string[]) =>
            prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
        );
    };

    return (
        <div>
            <Navbar />
            <div className="container mx-auto px-4">
                {/* Kategorie */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-4 text-center">
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
                            className={`rounded-3xl p-4 text-lg flex flex-col items-center w-full transition-all duration-300 relative overflow-hidden group ${selectedFilters.includes(category.name) ? "bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white font-semibold" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
                        >
                            <img
                                src={category.icon}
                                alt={category.name}
                                className="w-16 h-16 mb-2 transition-transform duration-300 group-hover:scale-110"
                            />
                            <span>{category.name}</span>
                        </button>
                    ))}
                </div>
                
                {/* Promo Bannery */}
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
            </div>
        </div>
    );
}