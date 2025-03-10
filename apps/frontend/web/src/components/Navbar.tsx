"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaBell, FaMapMarkerAlt, FaShoppingCart, FaCircle, FaHome, FaBuilding, FaPlus, FaMinus, FaCaretDown } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { useAuth } from "@/contexts/AuthProvider";

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [quantityDropdownOpen, setQuantityDropdownOpen] = useState<{ [key: string]: boolean }>({ pizza: false, burger: false });
  const [quantity, setQuantity] = useState<{ [key: string]: number }>({ pizza: 1, burger: 1 });
  const [activeAddress, setActiveAddress] = useState('');


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
  const { user, accessToken } = useAuth();
  if (!user) return null


  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const toggleQuantityDropdown = (item: string) => {
    setQuantityDropdownOpen((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleQuantityChange = (item: string, value: number) => {
    setQuantity((prev) => ({
      ...prev,
      [item]: value,
    }));
    setQuantityDropdownOpen((prev) => ({
      ...prev,
      [item]: false,
    }));
  };

  return (
    <div className="pt-[96px]">
    <div className="p-4 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex items-center px-4">
        <Link href="/">
          <div className="flex-shrink-0 text-white font-bold text-2xl bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] px-9 py- rounded-3xl mr-4 flex items-center h-[calc(48px+1rem)]">
            feedy.
          </div>
        </Link>

        <nav className="flex flex-1 items-center backdrop-blur-[8px] backdrop-saturate-[100%] bg-[#EFEFEF] bg-opacity-80 p-3 rounded-3xl relative h-[calc(50px+1rem)]">
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
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{unreadNotifications}</span>
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
                className="bg-white p-2 rounded-full shadow-md hover:bg-gray-200 w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-105"
                onClick={() => toggleDropdown("locations")}
              >
                <FaMapMarkerAlt className="text-gray-600 text-lg" />
              </button>
              {activeDropdown === "locations" && (
                <div className="absolute right-0 mt-2 w-72 bg-white shadow-2xl rounded-2xl p-2 z-40 transition-all duration-500 ease-in-out dropdown">
                  <div className="flex flex-col gap-2 p-2">
                    <div
                      className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-all duration-300 ease-in-out ${activeAddress === 'home' ? 'bg-[var(--primary-light)]' : 'hover:bg-gray-100'}`}
                      onClick={() => setActiveAddress('home')}
                    >
                      <span className={`rounded-full p-2 transition-all duration-300 ease-in-out ${activeAddress === 'home' ? 'bg-[var(--primary)]' : 'bg-[#EFEFEF]'}`}>
                        <FaHome className={activeAddress === 'home' ? 'text-white' : 'text-[var(--font)]'} />
                      </span>
                      <div>
                        <span className={activeAddress === 'home' ? 'text-[var(--primary)] font-bold transition-all duration-300 ease-in-out' : 'transition-all duration-300 ease-in-out'}>Domov</span>
                        <p className="text-sm text-gray-600">Ulice 123, Praha</p>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-all duration-300 ease-in-out ${activeAddress === 'work' ? 'bg-[var(--primary-light)]' : 'hover:bg-gray-100'}`}
                      onClick={() => setActiveAddress('work')}
                    >
                      <span className={`rounded-full p-2 transition-all duration-300 ease-in-out ${activeAddress === 'work' ? 'bg-[var(--primary)]' : 'bg-[#EFEFEF]'}`}>
                        <FaBuilding className={activeAddress === 'work' ? 'text-white' : 'text-[var(--font)]'} />
                      </span>
                      <div>
                        <span className={activeAddress === 'work' ? 'text-[var(--primary)] font-bold transition-all duration-300 ease-in-out' : 'transition-all duration-300 ease-in-out'}>Práce</span>
                        <p className="text-sm text-gray-600">Office Park 456</p>
                      </div>
                    </div>
                  </div>
                  <button className="items-center transition mt-2 p-2 hover:bg-orange-600 w-full rounded-2xl bg-[var(--primary)] text-white">
                    Přidat novou adresu
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                className="bg-white p-2 rounded-full shadow-md hover:bg-gray-200 w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-105"
                onClick={() => toggleDropdown("cart")}
              >
                <FaShoppingCart className="text-gray-600 text-lg" />
              </button>
              {activeDropdown === "cart" && (
                <div className="absolute right-0 mt-2 w-72 bg-white shadow-2xl rounded-2xl p-2 z-40 dropdown">
                  {['Pizza', 'Burger'].map((item, index) => (
                    <div key={index} className="p-2 text-gray-800 hover:bg-gray-100 rounded-2xl">
                      <p className="text-[var--(font)] font-bold">{item}</p>
                      <p className="text-sm text-gray-500">{item === 'Pizza' ? 'Pepperoni, sýr, rajčata' : 'Hovězí, salát, omáčka'}</p>
                      <div className="relative mt-2">
                        <button
                          className="bg-[#EFEFEF] p-1 rounded-full w-40 flex justify-between items-center"
                          onClick={() => toggleQuantityDropdown(item.toLowerCase())}
                        >
                          Množství: {quantity[item.toLowerCase()]}
                          <FaCaretDown />
                        </button>
                        {quantityDropdownOpen[item.toLowerCase()] && (
                          <div className="absolute right-0 mt-2 w-28 bg-white shadow-lg rounded-lg z-50">
                            {[1, 2, 3, 4, 5].map((value) => (
                              <button
                                key={value}
                                className="block w-full text-left p-2 hover:bg-gray-100"
                                onClick={() => handleQuantityChange(item.toLowerCase(), value)}
                              >
                                {value}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[var(--primary)]">300 Kč</span>
                      </div>
                    </div>
                  ))}
                  <hr className="my-2 border-t border-gray-300 shadow-md" />
                  <div className="text-[var(--primary)] text-lg font-bold mb-2">Celkem: 600 Kč</div>
                  <Link href="/checkout">
                    <button className="items-center transition p-2 hover:bg-orange-600 w-full rounded-2xl bg-[var(--primary)] text-white">Pokračovat k platbě</button>
                  </Link>
                </div>
              )}
            </div>

            <div className="relative flex items-center gap-2 cursor-pointer hover:bg-[#ffff] p-2 rounded-2xl transition-all duration-300" onClick={() => toggleDropdown("user")}>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md text-xl text-[var(--font)]">
                {user.name[0]}
              </div>
              <div>
                <p className="text-sm text-[var(--font)] font-bold">{user.name}</p>
                <p className="text-xs text-[var(--primary)]">{user.role}</p>
              </div>
              {activeDropdown === "user" && (
                <div className="absolute right-0 top-[calc(100%)] w-48 bg-white shadow-2xl rounded-2xl p-2 z-40 dropdown">
                  <Link href={`/profile/${user.id}`} className="block p-2 hover:bg-gray-100 rounded-xl">Účet</Link>
                  {user.role === 'Admin' && (
                    <Link href="/admin" className="block p-2 hover:bg-gray-100 rounded-xl">Admin Panel</Link>
                  )}
                  {user.role === 'Restaurant' && (
                    <Link href="/management" className="block p-2 hover:bg-gray-100 rounded-xl">Restaurant Panel</Link>
                  )}
                  <p className="block p-2 hover:bg-red-200 rounded-xl" onClick={handleSignOut}>Odhlásit se</p>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </div>
    </div>
  );
}
