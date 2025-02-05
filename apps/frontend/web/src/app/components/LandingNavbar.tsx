"use client";
import Link from "next/link";

const LandingNavbar = () => {
  return (
    <nav className="py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="text-[var(--primary)] font-bold text-3xl">feedy.</div>

        <div className="flex gap-4">
          <button className="bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white px-4 py-2 rounded-full font-medium transition-all duration-300 hover:brightness-110 hover:scale-105">
            Přihlásit se
          </button>
          <button className="bg-[var(--gray)] px-4 py-2 rounded-full text-[var(--font)] font-medium transition-all duration-300 hover:bg-gray-300 hover:scale-105">
            Registrace
          </button>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
