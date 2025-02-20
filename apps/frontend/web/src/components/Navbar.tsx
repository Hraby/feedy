"use client";

import { useState } from "react";
import { FaSearch, FaBell, FaMapMarkerAlt, FaShoppingCart } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { useAuth } from "@/contexts/AuthProvider";


export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleSignOut = async () => {
    await signOut();
  }
  const user = useAuth()
  if (!user) return null

  return (
    <div className="p-4">
      <div className="container mx-auto px-4 flex items-center w-full">
        <Link href="/">
          <div className="flex-shrink-0 text-white font-bold text-2xl bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] px-9 py- rounded-3xl mr-4 flex items-center h-[calc(48px+1rem)]"> {/* Added h-[calc(48px+1rem)] */}
            feedy.
          </div>
        </Link>


        <nav className="flex flex-1 items-center bg-[#EBEBEB] p-2 rounded-3xl relative h-[calc(50px+1rem)]">
          <div className="flex items-center bg-white rounded-full px-4 py-2 w-1/3">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Prohledat feedy"
              className="ml-2 w-full outline-none text-gray-600"
            />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-200 w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-105">
              <FaBell className="text-gray-600 text-lg" />
            </button>
            <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-200 w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-105">
              <FaMapMarkerAlt className="text-gray-600 text-lg" />
            </button>
            <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-200 w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-105">
              <FaShoppingCart className="text-gray-600 text-lg" />
            </button>

            <div
              className="relative flex items-center gap-2 cursor-pointer hover:bg-[#ffff] p-2 rounded-2xl transition-all duration-300"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Image
                src="/img/avatar.png"
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="text-sm text-[var(--font)] font-bold">{user.name}</p>
                <p className="text-xs text-[var(--primary)]">Admin</p>
              </div>
            </div>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-48 w-48 bg-white shadow-lg rounded-2xl p-2 transition-all duration-300 z-40">
                <p className="p-2 text-gray-800 hover:bg-gray-50 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105">Profil</p>
                <p className="p-2 text-gray-800 hover:bg-gray-50 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105" onClick={handleSignOut}>Odhlásit se</p>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};