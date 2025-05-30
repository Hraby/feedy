'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavbarSwitcher from "@/components/NavbarSwitch";
import Link from "next/link";
import { FaHome, FaBuilding, FaCircle, FaPlus, FaMinus } from "react-icons/fa";
import Footer from "@/components/Footer";
import Modal from "@/components/Modal";
import { useAuth } from "@/contexts/AuthProvider";
import { useShoppingCart } from "@/contexts/ShoppingCartContext";
import { BACKEND_URL } from "@/lib/constants";
import { toast, Slide, ToastContainer } from 'react-toastify';

type Address = {
  id: string;
  label: string;
  details: string;
  type: string;
  active: boolean;
};

type OrderDTO = {
  address: {
    city: string;
    zipCode: string;
    street: string;
    country: string;
  };
  restaurantId: string;
  items: {
    menuItemId: string;
    quantity: number;
    price: number;
  }[];
};

const Checkout = () => {
  const serviceFee = 8.25;
  const deliveryFee = 34;
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [activeAddress, setActiveAddress] = useState('');
  const [deliveryTime, setDeliveryTime] = useState<"asap" | "scheduled">("asap");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user, address, accessToken } = useAuth();
  const {
    cartItems,
    removeFromCart,
    increaseCartQuantity,
    decreaseCartQuantity,
    setOrderStatus,
    clearOrder
  } = useShoppingCart();

  
  const defaultAddress = {
    id: "home",
    label: "Domov",
    details: "náměstí Míru 12, 760 01, Zlín, Czechia",
    type: "home",
    active: true,
    city: "Zlín",
    zipCode: "760 01",
    street: "náměstí Míru 12",
    country: "Czechia"
  };

  const [addresses, setAddresses] = useState<Address[]>([defaultAddress]);

  useState(() => {
    if (address) {
      setAddresses([{
        id: "home",
        label: "Domov",
        details: `${address.street}, ${address.zipCode}, ${address.city}, ${address.country}`,
        type: "home",
        active: true
      }]);
    } else {
      setAddresses([{
        id: "home",
        label: "Domov",
        details: `náměstí Míru 12, 760 01, Zlín, Czechia`,
        type: "home",
        active: true
      }]);
    }
  });
  
  useEffect(() => {
    setAddresses([{
      id: "home",
      label: "Domov",
      details: address 
        ? `${address.street}, ${address.zipCode}, ${address.city}, ${address.country}`
        : defaultAddress.details,
      type: "home",
      active: true
    }]);
  }, [address]);

  useState(() => {
    const active = addresses.find((address) => address.active);
    if (active) setActiveAddress(active.details);
  });

  const handleSetActiveAddress = (id: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      active: addr.id === id
    })));
  };

  const handleQuantityChange = (id: string, amount: number) => {
    const item = cartItems.find((item: any) => item.id === id);
    if (item && item.quantity === 1 && amount === -1) {
      setItemToRemove(id);
      setIsModalOpen(true);
    } else {
      updateCart(id, amount);
    }
  };

  const updateCart = (id: string, amount: number) => {
    if (amount > 0) {
      increaseCartQuantity(id);
    } else {
      decreaseCartQuantity(id);
    }
  };

  const confirmRemoveItem = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove);
      toast.success(`Položka byla odebrána z košíku!`, {
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
    }
    setIsModalOpen(false);
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc: any, item: any) => acc + item.price * item.quantity, 0) + serviceFee + deliveryFee;
  };

  const handleCheckout = async () => {
    if (!user || cartItems.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const restaurantId = cartItems[0]?.restaurantId || "";

      const orderDto: OrderDTO = {
        address: {
          city: address?.city || defaultAddress.city,
          zipCode: address?.zipCode || defaultAddress.zipCode,
          street: address?.street || defaultAddress.street,
          country: address?.country || defaultAddress.country
        },
        restaurantId,
        items: cartItems.map((item: any) => ({
          menuItemId: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const response = await fetch(BACKEND_URL + '/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(orderDto)
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order = await response.json();

      setOrderStatus('Pending');
      clearOrder();

      router.push(`/order/${order.id}`);
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Nepodařilo se vytvořit objednávku. Zkuste to prosím znovu.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarSwitcher />
      <div className="w-full h-64 rounded-xl overflow-hidden mb-8">
        {addresses[0]?.details?.includes("Praha") ? (
          <iframe className="w-full h-full" src="https://frame.mapy.cz/s/duforevoto" title="Mapy.cz" loading="lazy"></iframe>
          ) : addresses[0]?.details?.includes("Brno") ? (
              <iframe className="w-full h-full" src="https://frame.mapy.cz/s/lanojojeno" title="Mapy.cz" loading="lazy"></iframe>
          ) : (
              <iframe className="w-full h-full" src="https://frame.mapy.cz/s/coveduzova" title="Mapy.cz" loading="lazy"></iframe>
        )}
      </div>

      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 grid-flow-dense flex-grow mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-6">Dokončení objednávky</h1>

          <label className="block mb-4 font-semibold">Kam to bude?</label>
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`flex items-center gap-2 p-2 rounded-2xl cursor-pointer w-2/3 transition-all duration-300 ease-in-out ${address.active ? 'bg-[var(--primary-light)] hover:bg-gray-100' : 'hover:bg-gray-100'}`}
              onClick={() => handleSetActiveAddress(address.id)}
            >
              <span className={`rounded-full p-2 transition-all duration-300 ease-in-out ${address.active ? 'bg-[var(--primary)]' : 'bg-[#EFEFEF]'}`}>
                {address.type === 'home' ? (
                  <FaHome className={address.active ? 'text-white' : 'text-[var(--font)]'} />
                ) : (
                  <FaBuilding className={address.active ? 'text-white' : 'text-[var(--font)]'} />
                )}
              </span>
              <div>
                <span className={address.active ? 'text-[var(--primary)] font-bold transition-all duration-300 ease-in-out' : 'transition-all duration-300 ease-in-out'}>
                  {address.label}
                </span>
                <p className="text-sm text-gray-600">{address.details}</p>
              </div>
            </div>
          ))}

          <Link href={`/profile/${user.id}`}>
            <button className="items-center font-bold transition mt-2 p-2 w-2/3 rounded-full bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white">
              Přidat novou adresu
            </button>
          </Link>

          <label className="block mt-6 mb-4 font-semibold">Kdy to bude?</label>
          <div className="flex flex-col gap-2 w-2/3">
            <button
              className={`p-4 text-left rounded-2xl border flex items-center gap-2 ${deliveryTime === "asap" ? "border-[var(--primary)]" : "border-[var(--gray)]"}`}
              onClick={() => setDeliveryTime("asap")}
            >
              <FaCircle className={deliveryTime === "asap" ? "text-[var(--primary)]" : "text-[var(--gray)]"} />
              <div>
                <span className="font-semibold">Co nejdříve</span>
                <p className="text-sm">Očekáváno doručení do 35 minut.</p>
              </div>
            </button>

            <button
              className={`p-4 text-left rounded-2xl border disabled cursor-not-allowed flex items-center gap-2 ${deliveryTime === "scheduled" ? "border-[var(--primary)]" : "border-[var(--gray)]"}`}
              disabled
            >
              <FaCircle className={deliveryTime === "scheduled" ? "text-[var(--primary)]" : "text-[var(--gray)]"} />
              <div className="flex flex-col gap-2 w-full">
                <div>
                  <span className="font-semibold text-gray-400">Naplánovat doručení</span>
                  <p className="text-sm text-gray-300">Naplánujte čas doručení dle vašich preferencí.</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white shadow-2xl rounded-3xl h-fit p-8 flex flex-col flex-grow mb-10">
          <div>
            <h2 className="text-2xl font-bold mb-6">Shrnutí objednávky</h2>

            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center">Košík je prázdný!</p>
            ) : (
              <>
                {cartItems.map((item: any) => (
                  <div key={item.id} className="p-2 text-gray-800 hover:bg-gray-100 rounded-2xl">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[var(--font)] font-bold">{item.name}</p>
                      </div>
                      <span className="text-[var(--primary)] text-lg">
                        {(item.price * item.quantity).toFixed(2)}Kč
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--gray)]"
                      >
                        <FaMinus className="text-[var(--font)]" />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--gray)]"
                      >
                        <FaPlus className="text-[var(--font)]" />
                      </button>
                    </div>
                  </div>
                ))}

                <hr className="my-4 border-t border-gray-200 shadow-sm" />

                <div className="p-2 text-gray-800 hover:bg-gray-100 rounded-2xl">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-[var(--font)] font-bold">Poplatek za službu</p>
                      <p className="text-sm text-gray-500 truncate">Poplatek za službu pomáhá zlepšit služby feedy.</p>
                    </div>
                    <span className="text-[var(--primary)] text-lg whitespace-nowrap">{serviceFee}Kč</span>
                  </div>
                </div>

                <div className="p-2 text-gray-800 hover:bg-gray-100 rounded-2xl">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-[var(--font)] font-bold">Poplatek za dopravu</p>
                      <p className="text-sm text-gray-500 truncate">Poplatek za doručení na adresu: {activeAddress}.</p>
                    </div>
                    <span className="text-[var(--primary)] text-lg whitespace-nowrap">{deliveryFee}Kč</span>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-bold text-[var(--primary)] mt-5">
                  <span>Celková cena</span>
                  <span>{calculateTotal()}Kč</span>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  className="mt-5 w-full font-bold text-lg bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white py-3 rounded-full"
                  onClick={handleCheckout}
                  disabled={isLoading || cartItems.length === 0}
                >
                  {isLoading ? 'Zpracovávám...' : 'Pokračovat k platbě'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />

      <ToastContainer/>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Odebrat položku</h2>
        <p className="text-gray-500">
          Opravdu chcete odebrat položku <strong>{cartItems.find((item) => item.id === itemToRemove)?.name}</strong> z košíku?
        </p>
        <p className="text-red-600 mb-4">Tato akce nelze vrátit zpět!</p>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Zrušit
          </button>
          <button
            onClick={confirmRemoveItem}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Odebrat
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Checkout;