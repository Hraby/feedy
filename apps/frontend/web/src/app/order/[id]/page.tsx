'use client';
import NavbarSwitcher from "@/components/NavbarSwitch";
import { useEffect, useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { FaPizzaSlice, FaTruck, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { MdDoneAll, MdRestaurant } from "react-icons/md";
import { GiCook } from "react-icons/gi";
import { useShoppingCart } from "@/contexts/ShoppingCartContext";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { BACKEND_URL } from "@/lib/constants";
import { useRouter } from "next/navigation";

const Order = () => {
    const { id } = useParams();
    const [orderStep, setOrderStep] = useState(1);
    const [deliveryTime] = useState("20 minut");
    const { orderStatus, setOrderStatus } = useShoppingCart();
    const {accessToken} = useAuth();
    
    const router = useRouter();

    type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'OutForDelivery' | 'Delivered' | 'Cancelled';

    const statusToStepMap: Record<OrderStatus, number> = {
        "Pending": 1,
        "Preparing": 2,
        "Ready": 3,
        "OutForDelivery": 4,
        "Delivered": 5,
        "Cancelled": 1
    };

    useEffect(() => {
        if (!accessToken) return;
        const fetchOrderStatus = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/order/${id}/status`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                });

                if (response.status === 404) {
                    router.replace("/404");
                    return;
                }

                if (!response.ok) throw new Error("Failed to fetch order status");
                
                const data = await response.json();
                const status = data.status as OrderStatus;
                setOrderStatus(status);
                
                if (status && status in statusToStepMap) {
                    setOrderStep(statusToStepMap[status]);
                }
            } catch (error) {
                console.error("Error fetching order status:", error);
            }
        };

        fetchOrderStatus();
        
        const intervalId = setInterval(fetchOrderStatus, 5000);
        
        return () => clearInterval(intervalId);
    }, [id, setOrderStatus, accessToken]);

    const isOrderComplete = orderStep === 6;

    const steps = [
        { id: 1, label: "Čeká se na restauraci", icon: <FiCheckCircle /> },
        { id: 2, label: "Objednávka se připravuje", icon: <GiCook /> },
        { id: 3, label: "Objednávka je připravena", icon: <FaPizzaSlice /> },
        { id: 4, label: "Objednávka je na cestě", icon: <FaTruck /> },
        { id: 5, label: "Objednávka byla doručena!", icon: <MdDoneAll /> },
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
                <div className="flex items-center mb-8 relative">
                    {steps.map((step, index) => (
                        <div key={step.id} className={`flex items-center ${index < steps.length - 1 ? 'w-full' : ''}`}>
                            <div
                                className={`p-3 rounded-full z-10 ${
                                    orderStep === step.id 
                                        ? `${isOrderComplete ? 'bg-green-500' : 'bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)]'} text-white`
                                        : orderStep > step.id
                                            ? 'bg-gray-400 text-white'
                                            : "bg-gray-200 text-gray-400"
                                }`}
                            >
                                {step.icon}
                            </div>
                            {index < steps.length - 1 && (
                                <div className="h-1.5 flex-grow relative overflow-hidden bg-gray-200">
                                    {orderStep > step.id && (
                                        <div
                                        className="absolute inset-0"
                                        style={{background: isOrderComplete ? "#22c55e" : "linear-gradient(to right, var(--gradient-end), var(--gradient-start))",
                                          width: "100%",
                                        }}
                                      />                                      
                                    )}
                                    {orderStep === step.id && index < steps.length - 1 && (
                                        <motion.div
                                            className="absolute inset-0"
                                            animate={{ x: ["-100%", "250%"] }}
                                            transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                                            style={{ backgroundColor: isOrderComplete ? "#22c55e" : "var(--gradient-end)", width: "150px" }}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="auto-cols-fr grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="col-span-2">
                        <h2 className={`text-4xl font-bold mb-4 ${isOrderComplete ? "text-green-500" : "text-[var(--primary)]"}`}>
                        {isOrderComplete ? (
                                <div>
                                    {steps[orderStep - 1].label}
                                </div>
                            ) : (
                                <div>
                                    {orderStep}. {steps[orderStep - 1].label}...
                                </div>
                            )}
                        </h2>

                        {isOrderComplete && (
                            <p className="text-lg text-gray-600 mt-4">Děkujeme za vaši objednávku!<br></br>Doufáme, že vám chutnalo a těšíme se na vaši příští návštěvu.</p>
                        )}

                        <ul className="space-y-2 text-2xl text-gray-500">
                            {steps.slice(0, orderStep - 1).map((step) => (
                                <li key={`previous-${step.id}`} className="text-gray-400">
                                    {step.id}. {step.label}
                                </li>
                            ))}
                            
                            {steps.slice(orderStep).map((step) => (
                                <li key={step.id}>
                                    {step.id}. {step.label}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex justify-end">
                        <div className="bg-white shadow-2xl rounded-3xl p-10 text-center w-30 h-fit">
                            {isOrderComplete ? (
                                <div>
                                    <FaCheckCircle className="text-green-500 text-6xl mx-auto" />
                                    <p className="text-gray-500 mt-3 text-md">OBJEDNÁVKA BYLA DORUČENA<br></br>NA VAŠÍ ADRESU</p>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-[var(--primary)] text-4xl font-bold">{deliveryTime}</h3>
                                    <p className="text-gray-500 mt-3 text-md">ODHADOVANÝ ČAS DORUČENÍ</p>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Order;