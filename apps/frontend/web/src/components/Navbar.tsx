"use client";

import { useState, useEffect } from "react";
import { FaBell, FaMapMarkerAlt, FaShoppingCart, FaCircle, FaHome, FaBuilding, FaPlus, FaMinus, FaSearch, FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { useAuth } from "@/contexts/AuthProvider";
import AutoComplete from "./autoComplete";
import { useShoppingCart } from "@/contexts/ShoppingCartContext";

export default function Navbar() {
  const serviceFee = 8.25;
  const deliveryFee = 34;
  const { address } = useAuth()
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.classList.toggle("overflow-hidden", isMobileMenuOpen);
  };

  const [addresses, setAddresses] = useState([{ id: 'home', label: 'Domov', details: 'Ulice 123, Praha', type: 'home', active: true }]);

  useEffect(() => {
    if (address) {
      setAddresses([{ id: "home", label: "Domov", details: `${address.street}, ${address.zipCode}, ${address.city}, ${address.country}`, type: "home", active: true }])
    } else {
      setAddresses([{ id: "home", label: "Domov", details: `náměstí Míru 12, 760 01, Zlín, Czechia`, type: "home", active: true }])
    }
  }, [address]);

  const { cartItems, increaseCartQuantity, decreaseCartQuantity, cartQuantity } = useShoppingCart();

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    return subtotal + serviceFee + deliveryFee;
  };

  type Notification = {
    id: number;
    title: string;
    description: string;
    isNew: boolean;
  };

  const notifications: Notification[] = [];
  const unreadNotifications = notifications.filter((notification) => notification.isNew).length;


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if ((event.target as HTMLElement).closest('.dropdown') === null) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
  }
  const { user } = useAuth();
  if (!user) return null

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleSetActiveAddress = (id: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      active: addr.id === id
    })));
  };

  return (
    <div className="pt-[96px]">
      <div className="p-4 fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto flex items-center px-4">
          <Link href="/menu">
            <div className="flex-shrink-0 text-white font-bold text-2xl bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] px-9 py- rounded-3xl mr-4 flex items-center h-[calc(48px+1rem)]">
              feedy.
            </div>
          </Link>

          <nav className="hidden md:flex flex-1 items-center backdrop-blur-[8px] backdrop-saturate-[100%] bg-[#EFEFEF] bg-opacity-80 p-3 rounded-3xl relative h-[calc(50px+1rem)]">
            <div className="flex items-center bg-white rounded-full px-4 py-2 w-1/3">
              <FaSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Prohledat feedy"
                className="ml-2 w-full outline-none text-gray-600"
              />
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <div className="relative">
                <button
                  className="bg-white p-2 rounded-full shadow-md hover:bg-gray-200 w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-105"
                  onClick={() => toggleDropdown("notifications")}
                >
                  <FaBell className="text-gray-600 text-lg" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{unreadNotifications}</span>
                  )}
                </button>
                {activeDropdown === "notifications" && (
                  <div className="absolute right-0 mt-2 w-96 bg-white shadow-2xl rounded-2xl p-2 z-40 dropdown">
                    <h3 className="text-lg font-bold p-2">Oznámení ({notifications.length})</h3>
                    <div>
                      {notifications.map((notification) => (
                        <div key={notification.id} className="flex flex-col gap-2 p-2 hover:bg-gray-100 cursor-pointer rounded-2xl">
                          <div className="flex items-center gap-2">
                            {notification.isNew && <FaCircle className="text-red-500 text-xs" />}
                            <p className="text-[var(--font)] font-bold">{notification.title}</p>
                          </div>
                          <p className="text-gray-600 text-sm">{notification.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  className="bg-white p-2 rounded-full shadow-md hover:bg-gray-200 flex items-center gap-2 transition-all duration-300"
                  onClick={() => {
                    toggleDropdown("locations");
                    setIsEditing(false);
                  }}
                >
                  <FaMapMarkerAlt className="text-gray-600 text-lg" />
                  <span className="text-gray-700 font-medium">{address?.city || "Zlín"}</span>
                </button>

                {activeDropdown === "locations" && (
                  <div
                    className="absolute right-0 mt-2 w-80 bg-white shadow-2xl rounded-2xl p-4 z-40 transition-all duration-500 ease-in-out dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {isEditing ? (
                      <AutoComplete onClose={() => setIsEditing(false)} />
                    ) : (
                      <div className="flex flex-col gap-2">
                        {addresses.map((address) => (
                          <div
                            key={address.id}
                            className={`flex items-center justify-between gap-2 p-2 rounded-xl cursor-pointer transition-all duration-300 ease-in-out ${address.active ? "bg-[var(--primary-light)]" : "hover:bg-gray-100"
                              }`}
                            onClick={() => handleSetActiveAddress(address.id)}
                          >
                            <span
                              className={`rounded-full p-2 transition-all duration-300 ease-in-out ${address.active ? "bg-[var(--primary)]" : "bg-[#EFEFEF]"
                                }`}
                            >
                              {address.type === "home" ? (
                                <FaHome className={address.active ? "text-white" : "text-[var(--font)]"} />
                              ) : (
                                <FaBuilding className={address.active ? "text-white" : "text-[var(--font)]"} />
                              )}
                            </span>
                            <div className="flex flex-col">
                              <span className={`${address.active ? "text-[var(--primary)] font-bold" : ""}`}>
                                {address.label}
                              </span>
                              <p className="text-sm text-gray-600">{address.details}</p>
                            </div>
                          </div>
                        ))}
                        {/* <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(true);
                          }}
                          className="w-full mt-2 p-2 text-center text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-all duration-300"
                        >
                          Změnit adresu
                        </button> */}
                        <Link href={`/profile/${user.id}`}>
                          <button className="items-center font-bold transition mt-2 p-2 w-full rounded-full bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white">
                            Upravit adresu
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  className="bg-white p-2 rounded-full shadow-md hover:bg-gray-200 w-10 h-10 flex items-center justify-center relative"
                  onClick={() => toggleDropdown("cart")}
                >
                  <FaShoppingCart className="text-gray-600 text-lg" />
                  {cartQuantity > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartQuantity > 9 ? "9+" : cartQuantity}
                    </span>
                  )}
                </button>
                {activeDropdown === "cart" && (
                  <div className="absolute right-0 mt-2 w-72 bg-white shadow-2xl rounded-2xl p-2 z-40 dropdown">
                    {cartItems.length === 0 ? (
                      <p className="text-gray-500 text-center">Košík je prázdný!</p>
                    ) : (
                      <>
                        {cartItems.map((item) => (
                          <div key={item.id} className="p-2 text-gray-800 hover:bg-gray-100 rounded-2xl">
                            <p className="text-[var(--font)] font-bold">{item.name}</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => decreaseCartQuantity(item.id)}
                                  className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--gray)]"
                                >
                                  <FaMinus className="text-[var(--font)]" />
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                  onClick={() => increaseCartQuantity(item.id)}
                                  className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--gray)]"
                                >
                                  <FaPlus className="text-[var(--font)]" />
                                </button>
                              </div>
                              <span className="text-[var(--primary)] text-lg">{item.price * item.quantity} Kč</span>
                            </div>
                          </div>
                        ))}
                        <hr className="my-2 border-t border-gray-100 shadow-md" />
                        <div className="flex justify-between text-gray-600 text-sm">
                          <div>Poplatek za službu:</div>
                          <div className="text-[var(--primary)]">{serviceFee} Kč</div>
                        </div>
                        <div className="flex justify-between text-gray-600 text-sm">
                          <div>Poplatek za dopravu:</div>
                          <div className="text-[var(--primary)]">{deliveryFee} Kč</div>
                        </div>
                        <hr className="my-2 border-t border-gray-100 shadow-md" />
                        <div className="flex justify-between text-[var(--primary)] text-lg font-bold mb-2">
                          <div>Celkem:</div>
                          <div>{calculateTotal()} Kč</div>
                        </div>
                        <Link href="/checkout">
                          <button className="items-center font-bold transition p-2 w-full rounded-full bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white">
                            Shrnutí objednávky
                          </button>
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="relative flex items-center gap-2 cursor-pointer hover:bg-[#ffff] p-2 rounded-2xl transition-all duration-300" onClick={() => toggleDropdown("user")}>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md text-xl text-[var(--font)]">
                  {user.name[0]}
                </div>
                <div>
                  <p className="text-sm text-[var(--font)] font-bold">{user.name}</p>
                  <p className="text-xs text-[var(--primary)]">{user.role.includes("Admin") ? "Admin" : user.role.includes("Restaurant") ? "Restaurant" : "User"}</p>                </div>
                {activeDropdown === "user" && (
                  <div className="absolute right-0 top-[calc(100%)] w-48 bg-white shadow-2xl rounded-2xl p-2 z-40 dropdown">
                    <Link href={`/profile/${user.id}`} className="block p-2 hover:bg-gray-100 rounded-xl">Účet</Link>
                    {user.role.includes("Admin") && (
                      <Link href="/admin" className="block p-2 hover:bg-gray-100 rounded-xl">
                        Admin Panel
                      </Link>
                    )}
                    {user.role.includes("Restaurant") && (
                      <Link href="/management" className="block p-2 hover:bg-gray-100 rounded-xl">
                        Restaurant Panel
                      </Link>
                    )}
                    <p className="block p-2 hover:bg-red-200 rounded-xl" onClick={handleSignOut}>Odhlásit se</p>
                  </div>
                )}
              </div>
            </div>
          </nav>
          <button onClick={toggleMobileMenu} className="md:hidden p-2 bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white rounded-full shadow-md flex items-center gap-2 transition-all duration-300 hover:scale-105 ml-auto">
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="fixed top-0 left-0 w-full h-fit bg-white z-40 shadow-2xl flex flex-col p-6 rounded-2xl md:hidden pt-20">
          <div className="space-y-4 text-center">
            <Link href="/menu" className="flex items-center justify-center h-14 text-xl font-bold text-gray-800 border-b w-full">
              Menu
            </Link>
            <Link href={`/profile/${user.id}`} className="flex items-center justify-center h-14 text-xl font-bold text-gray-800 border-b w-full">
              Profil
            </Link>
            <Link href="/checkout" className="flex items-center justify-center h-14 text-xl font-bold text-gray-800 border-b w-full">
              Košík ({cartQuantity})
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center h-14 text-xl font-bold text-red-500 w-full"
            >
              Odhlásit se
            </button>
          </div>
        </div>
      )}



    </div>
  );
}