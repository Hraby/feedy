'use client';
import NavbarSwitcher from "@/components/NavbarSwitch";
import { useState, useEffect } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { FaPizzaSlice, FaTruck } from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";

const Order = () => {
    const [orderStep] = useState(1);
    const [deliveryTime] = useState("20 minut");

    const steps = [
        { id: 1, label: "Objednávka byla přijata", icon: <FiCheckCircle /> },
        { id: 2, label: "Objednávka se připravuje", icon: <FaPizzaSlice /> },
        { id: 3, label: "Objednávka čeká na vyzvednutí kurýrem", icon: <FaTruck /> },
        { id: 4, label: "Objednávka je na cestě", icon: <FaTruck /> },
    ];

    return (
        <div>
            <NavbarSwitcher />

            <div className="w-full h-64 rounded-xl overflow-hidden mb-8">
                <iframe
                    className="w-full h-full"
                    src="https://frame.mapy.cz/s/kuhopelogo"
                    title="Mapy.cz"
                    loading="lazy"
                ></iframe>
            </div>

            <div className="container mx-auto px-4">
                <div className="flex items-center mb-8">
                    {steps.map((step, index) => (
                        <div key={step.id} className={`flex items-center ${index < steps.length - 1 ? 'w-full' : ''}`}>
                            <div
                                className={`p-3 rounded-full ${orderStep >= step.id
                                        ? "bg-[var(--primary)] text-white"
                                        : "bg-gray-200 text-gray-400"
                                    }`}
                            >
                                {step.icon}
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`h-1.5 flex-grow ${orderStep > step.id ? "bg-[var(--primary)]" : "bg-gray-200"}`}
                                ></div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="auto-cols-fr grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="col-span-2">
                        <h2 className="text-4xl font-bold text-[var(--primary)] mb-4">
                            {steps[orderStep - 1].label}...
                        </h2>

                        <ul className="text-gray-500 space-y-2">
                            {steps.map((step) => (
                                <li key={step.id} className={orderStep === step.id ? "text-xl font-semibold text-[var(--font)]" : ""}>
                                    {step.id}. {step.label}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex justify-end">
                        <div className="bg-white shadow-2xl rounded-3xl p-10 text-center w-70 h-fit">
                            <h3 className="text-[var(--primary)] text-4xl font-bold">{deliveryTime}</h3>
                            <p className="text-gray-500 mt-1 text-lg">ODHADOVANÝ ČAS DORUČENÍ</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <button className="border p-4 rounded-xl flex flex-col items-start w-1/3">
                        <span className="font-semibold">Rekapitulace objednávky</span>
                        <span className="text-gray-500 block">Prohlédněte si zpětně vaši objednávku</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Order;