"use client";

import Image from "next/image";
import AppWidget from "../components/LandingWidget";
import Footer from "../components/Footer";
import { FiMapPin } from 'react-icons/fi';
import { FaShoppingBasket, FaBolt, FaStar } from 'react-icons/fa';
import JoinFeedy from "../components/JoinFeedy";
import NavbarSwitcher from "@/components/NavbarSwitch";
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthProvider";

const slogans = [
  "Doručíme vám jídlo rychlostí blesku!",
  "Objevte nové restaurace v okolí!",
  "Podporujte s námi místní podniky!",
  "Vaše oblíbené jídlo je na dosah ruky!",
  "Měníme způsob objednávání jídla!",
  "Rychle a jednoduše, to je feedy!"
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

export default function Home() {
  const [sloganIndex, setSloganIndex] = useState(0);
  const { user, accessToken } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setSloganIndex((prevIndex) => (prevIndex + 1) % slogans.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);


  return (
    <>
      <div className="bg-white">
        <NavbarSwitcher />
        <div className="container mx-auto px-4">
          <section className="min-h-[85vh] flex flex-col lg:flex-row items-center gap-4 lg:gap-64 py-30 lg:py-16 text-center lg:text-left pt-20">
            <div className="max-w-3xl">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={sloganIndex}
                  initial={{ opacity: 0, y: 21 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -21 }}
                  transition={{ duration: 0.6 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold p-1 bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] bg-clip-text text-transparent"
                >
                  {slogans[sloganIndex]}
                </motion.h1>
              </AnimatePresence>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mt-4 relative w-full max-w-md mx-auto lg:mx-0 lg:text-left flex justify-center lg:justify-start space-x-4"
              >
                <button
                  className="bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] transition-transform duration-300 hover:scale-105 text-white px-7 py-2 rounded-full text-lg font-semibold shadow-lg whitespace-nowrap"
                  onClick={() => window.location.href = user ? '/menu' : '/login'}
                >
                  {user ? 'Mám hlad!' : 'Nejprve se přihlásím'}
                </button>
                {!user && (
                  <button
                    className="bg-[var(--gray)] transition-transform duration-300 hover:scale-105 px-7 py-2 rounded-full text-lg font-semibold whitespace-nowrap"
                    onClick={() => window.location.href = '/register'}
                  >
                    Nejprve se zaregistruji
                  </button>
                )}
              </motion.div>

            </div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="mt-8 lg:mt-0">
                <Image
                  src="/img/burger.png"
                  alt="Burger a hranolky"
                  width={450}
                  height={350}
                  className="mx-auto animate-pulse-burger-pause"
                />
              </div>
            </motion.div>
          </section>
        </div>
      </div>

      <div className="custom-shape-divider-bottom mt-16 lg:mt-28">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
        </svg>
      </div>

      <section className="bg-[#EFEFEF] pb-12 lg:pb-16 pt-28">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold">Rychle a pohodlně? Jedině s feedy!</h2>
          <p className="mt-2 text-base lg:text-lg text-[var(--font)]">
            Rozlučte se s nekonečným čekáním na vaši objednávku!
            <br />
            Jídlo k vám dorazí čerstvé, včas a bez stresu.
          </p>
        </div>
        <div className="container mx-auto px-6 md:px-12">
          <div className="mt-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { title: "Podporujeme místní podniky", text: "S každou objednávkou podpoříte podniky ve vašem okolí.", icon: <FaShoppingBasket /> },
              { title: "Doručení rychlostí blesku", text: "Zapomeňte na nekonečné čekání a objednejte si rychlostí blesku.", icon: <FaBolt /> },
              { title: "Získejte odměny za objednávky", text: "Čím více objednáte, tím více získáte odměn a slev na další objednávky.", icon: <FaStar /> },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 lg:p-10 lg:py-20 rounded-card shadow-md text-center max-w-sm mx-auto min-h-[200px] flex flex-col justify-between"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="bg-[var(--primary)] p-4 rounded-full inline-flex items-center justify-center w-16 h-16 mx-auto text-white text-3xl">
                  {item.icon}
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-[var(--primary)] mt-5">{item.title}</h3>
                <p className="text-[var(--font)] mt-2">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#EFEFEF] pb-12 lg:pb-16 pt-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="container mx-auto px-4">
            <AppWidget />
          </div>
        </motion.div>
      </section>

      <section className="bg-[#EFEFEF]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <JoinFeedy></JoinFeedy>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}