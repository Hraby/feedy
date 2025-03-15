'use client';
import NavbarSwitcher from "@/components/NavbarSwitch";
import { useAuth } from "@/contexts/AuthProvider";
import Footer from "@/components/Footer";
import Link from "next/link";

const NotFound = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarSwitcher />
      <div className="container mx-auto px-4 flex-grow flex flex-col items-center justify-center text-center">
        <h1 className="text-9xl font-extrabold bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] bg-clip-text text-transparent">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 mt-4">Tudy cesta nevede...</h2>
        <p className="text-lg text-gray-500 mt-2">Stránka, kterou hledáte, neexistuje nebo byla přesunuta.</p>
        <div className="mt-6 flex space-x-4">
          <Link 
            href={user ? "/menu" : "/login"} 
            className="px-6 py-3 bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] transition-transform duration-300 hover:scale-105 text-white text-lg font-medium rounded-full"
          >
            {user ? "Jít na menu" : "Přihlásit se"}
          </Link>
          {!user && (
            <Link 
              href="/register" 
              className="px-6 py-3 bg-[var(--gray)] text-lg font-medium rounded-full transition-transform duration-300 hover:scale-105"
            >
              Zaregistrovat se
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;