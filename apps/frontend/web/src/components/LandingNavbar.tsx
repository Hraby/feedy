"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";

const LandingNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showShadow, setShowShadow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 50;
      if (window.scrollY > scrollThreshold) {
        setShowShadow(true);
      } else {
        setShowShadow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="pt-[80px]">
      <nav
        className={`py-4 bg-white fixed top-0 left-0 w-full z-50 transition-all duration-300 ${showShadow ? "drop-shadow-lg" : ""
          }`}
      >
        <div className="container mx-auto px-6 md:px-10 lg:px-4 flex justify-between items-center">
          <Link href="/">
            <div className="text-[var(--primary)] font-bold text-3xl">feedy.</div>
          </Link>


          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-[var(--primary)] text-3xl"
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>

          <div
            className={`md:flex gap-4 transition-transform duration-300 ease-in-out ${menuOpen
                ? "flex flex-col absolute top-16 left-0 w-full bg-white shadow-md p-4 transform translate-y-0 opacity-100"
                : "hidden transform -translate-y-10 opacity-0 md:opacity-100 md:translate-y-0"
              } md:static md:w-auto md:p-0 md:shadow-none md:bg-transparent`}
          >
            <Link href="/login">
              <button className="bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white px-4 py-2 rounded-full font-medium transition-all duration-300 hover:brightness-110 hover:scale-105">
                Přihlásit se
              </button>
            </Link>
            <Link href="/register">
              <button className="bg-[var(--gray)] px-4 py-2 rounded-full text-[var(--font)] font-medium transition-all duration-300 hover:bg-gray-300 hover:scale-105">
                Registrace
              </button>
            </Link>
          </div>
        </div>
      </nav>
    </div>

  );
};

export default LandingNavbar;