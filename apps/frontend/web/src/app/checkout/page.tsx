'use client';

import { useState } from "react";
import NavbarSwitcher from "@/components/NavbarSwitch";
import Link from "next/link";
import { FaTruck, FaWalking, FaCircle } from "react-icons/fa";

const Checkout = () => {
    const [deliveryType, setDeliveryType] = useState("delivery");
    const [address, setAddress] = useState("Dřevnická 1788, 760 01 Zlín");
    const [deliveryTime, setDeliveryTime] = useState("asap");
    const [items, setItems] = useState([
        { name: "Döner klasický", price: 205, quantity: 1 },
    ]);
    const serviceFee = 8.25;
    const deliveryFee = 34;

    const totalPrice =
        items.reduce((sum, item) => sum + item.price * item.quantity, 0) +
        serviceFee +
        deliveryFee;

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

            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 grid-flow-dense">
                <div>
                    <h1 className="text-3xl font-bold mb-6">Dokončení objednávky</h1>

                    <div className="flex gap-4 mb-8">
                        <label>
                            <input
                                type="radio"
                                name="deliveryType"
                                value="delivery"
                                checked={deliveryType === "delivery"}
                                onChange={() => setDeliveryType("delivery")}
                                className="hidden"
                            />
                            <div
                                className={`flex items-center gap-2 px-4 py-2 rounded-2xl cursor-pointer ${deliveryType === "delivery" ? "bg-[var(--font)] text-white font-bold" : "bg-[var(--gray)]"
                                    }`}
                            >
                                <FaTruck /> Rozvoz
                            </div>
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="deliveryType"
                                value="pickup"
                                checked={deliveryType === "pickup"}
                                onChange={() => setDeliveryType("pickup")}
                                className="hidden"
                            />
                            <div
                                className={`flex items-center gap-2 px-4 py-2 rounded-2xl cursor-pointer ${deliveryType === "pickup" ? "bg-[var(--font)] text-white font-bold" : "bg-[var(--gray)]"
                                    }`}
                            >
                                <FaWalking /> Vyzvednout
                            </div>
                        </label>
                    </div>

                    <label className="block mb-4 font-semibold">Kam to bude?</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-96 px-4 py-2 border rounded-lg border-[var(--gray)]"
                    />

                    <label className="block mt-6 mb-4 font-semibold">Kdy to bude?</label>
                    <div className="flex flex-col gap-2 w-96">
                        <button
                            className={`p-4 text-left rounded-2xl border flex items-center gap-2 ${deliveryTime === "asap" ? "border-[var(--primary)]" : "border-[var(--gray)]"
                                }`}
                            onClick={() => setDeliveryTime("asap")}
                        >
                            <FaCircle className={deliveryTime === "asap" ? "text-[var(--primary)]" : "text-[var(--gray)]"} />
                            <div>
                                <span className="font-semibold">Co nejdříve</span>
                                <p className="text-sm">Očekáváno doručení do 35 minut.</p>
                            </div>
                        </button>
                        <button
                            className={`p-4 text-left rounded-2xl border flex items-center gap-2 ${deliveryTime === "scheduled" ? "border-[var(--primary)]" : "border-[var(--gray)]"
                                }`}
                            onClick={() => setDeliveryTime("scheduled")}
                        >
                            <FaCircle className={deliveryTime === "scheduled" ? "text-[var(--primary)]" : "text-[var(--gray)]"} />
                            <div>
                                <span className="font-semibold">Naplánovat doručení</span>
                                <p className="text-sm">Naplánujte čas doručení dle vašich preferencí</p>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="bg-white shadow-2xl rounded-3xl h-fit p-8 flex flex-col flex-grow">
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Shrnutí objednávky</h2>

                        {items.map((item, index) => (
                            <div key={index} className="flex justify-between mb-2">
                                <span>{item.quantity}x {item.name}</span>
                                <span>{item.price.toFixed(2)} Kč</span>
                            </div>
                        ))}

                        <div className="flex justify-between mb-2">
                            <span>Poplatek za službu</span>
                            <span>{serviceFee.toFixed(2)} Kč</span>
                        </div>

                        <div className="flex justify-between mb-2">
                            <span>Poplatek za dopravu</span>
                            <span>{deliveryFee.toFixed(2)} Kč</span>
                        </div>

                        <div className="flex justify-between text-xl font-bold text-[var(--primary)] mt-5">
                            <span>Celková cena</span>
                            <span>{totalPrice.toFixed(2)} Kč</span>
                        </div>
                    </div>

                    <button className="mt-5 w-full font-bold text-lg bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white py-3 rounded-full">
                        Pokračovat k platbě
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;