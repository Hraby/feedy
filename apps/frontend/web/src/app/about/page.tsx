'use client';

import NavbarSwitcher from "@/components/NavbarSwitch";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function About() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <NavbarSwitcher />
            <div className="container mx-auto px-4 flex-grow">
                <div className="relative h-[350px] overflow-hidden rounded-3xl">
                    <Image
                        src="/img/about-hero.jpg"
                        alt="Jídlo"
                        width={1200}
                        height={350}
                        className="w-full h-full rounded-3xl object-cover"
                    />

                    <div className="absolute inset-0 bg-black bg-opacity-10"></div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                        <h1 className="text-6xl font-bold text-white mb-4">
                            Měníme způsob objednávání jídla.
                        </h1>
                        <p className="text-xl max-w-3xl text-white">
                            Feedy vám umožňuje objednávat jídlo jednoduše, rychle a pohodlně.
                        </p>
                    </div>
                </div>
            </div>


            <div className="container mx-auto px-6">
                <div className="py-16 grid md:grid-cols-2 gap-10 items-center">
                    <div className="bg-white p-16 rounded-3xl shadow-lg">
                        <p className="text-[var(--primary)] font-semibold">Jak to všechno začalo?</p>
                        <h2 className="text-4xl font-bold mt-2">
                            Naším snem bylo přinést revoluci v doručování jídla
                        </h2>
                        <p className="text-gray-600 mt-4">
                            Feedy bylo založeno s vášní pro inovace a zlepšování života. Naším cílem je propojit restaurace s hladovými zákazníky a přinést pohodlné a rychlé objednávky jídla.
                        </p>
                    </div>
                    <div className="w-full">
                        <Image
                            src="/img/about.jpg"
                            alt="Tým Feedy"
                            width={600}
                            height={400}
                            className="rounded-3xl shadow-lg w-full object-cover"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-2 pb-20">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-16 rounded-3xl shadow-md text-center">
                            <h3 className="text-3xl font-bold">{stat.value}</h3>
                            <p className="text-gray-500">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>



            <Footer />
        </div>
    );
}

const stats = [
    { value: "3+ roky", label: "Zkušeností" },
    { value: "50+", label: "Restaurací" },
    { value: "10K+", label: "Spokojených zákazníků" },
    { value: "98%", label: "Hodnocení" },
];
