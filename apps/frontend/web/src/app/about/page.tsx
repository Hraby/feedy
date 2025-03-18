'use client';

import NavbarSwitcher from "@/components/NavbarSwitch";
import Footer from "@/components/Footer";
import Image from "next/image";
import { motion } from 'framer-motion';

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const sections = [
    {
        image: "/img/about-first.jpg",
        alt: "Jak to všechno začalo?",
        title: "Jak to všechno začalo?",
        heading: "Naším snem bylo přinést revoluci v doručování jídla",
        text: "Feedy bylo založeno s vášní pro inovace a zlepšování života. Naším cílem je propojit restaurace s hladovými zákazníky a přinést pohodlné a rychlé objednávky jídla.",
    },
    {
        image: "/img/about-second.jpg",
        alt: "Naše mise",
        title: "Naše mise",
        heading: "Přinášíme rychlé a kvalitní doručování jídla",
        text: "Snažíme se zajistit, aby každá objednávka byla doručena co nejrychleji a v perfektní kvalitě. Spolupracujeme s nejlepšími restauracemi a dbáme na spokojenost našich zákazníků.",
    },
    {
        image: "/img/about-third.jpg",
        alt: "Budoucnost feedy",
        title: "Budoucnost feedy",
        heading: "Neustále inovujeme a rozšiřujeme naše služby",
        text: "Pracujeme na nových funkcích, které zlepší váš zážitek s Feedy. Od vylepšené navigace po nové restaurace v nabídce – sledujte naše novinky!",
    },
];

const stats = [
    { value: "1", label: "rok zkušeností" },
    { value: "10+", label: "restaurací" },
    { value: "10+", label: "spokojených zákazníků" },
    { value: "98%", label: "celkové hodnocení" },
];

const teamMembers = [
    {
        name: "Ondřej Masný",
        academic_degree: "Ing.",
        role: "motivator",
        image: "/img/ondrej-masny.jpg",
    },
    {
        name: "Jan Běhunčík",
        role: "website",
        image: "/img/jan-behuncik.jpg",
    },
    {
        name: "Mirek Ondroušek",
        role: "mobile",
        image: "/img/mirek-ondrousek.jpg",
    },
    {
        name: "Michal Hrabal",
        role: "backend",
        image: "/img/michal-hrabal.jpg",
    },
];


export default function About() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <NavbarSwitcher />

            <div className="container mx-auto px-4 flex-grow">
                <div className="relative h-[250px] sm:h-[250px] lg:h-[350px] overflow-hidden rounded-3xl">
                    <Image
                        src="/img/about-hero.jpg"
                        alt="Jídlo"
                        width={1200}
                        height={350}
                        className="w-full h-full rounded-3xl object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
                            Měníme způsob objednávání jídla.
                        </h1>
                        <p className="text-lg sm:text-xl max-w-3xl text-white">
                            Feedy vám umožňuje objednávat jídlo jednoduše, rychle a pohodlně.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {sections.map((section, index) => (
                    <motion.div
                        key={index}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <div className="py-10 grid md:grid-cols-2 gap-10 items-center">
                            <div className={`w-full flex items-center ${index % 2 === 0 ? "" : "md:order-2"}`}>
                                <Image
                                    src={section.image}
                                    alt={section.alt}
                                    width={600}
                                    height={400}
                                    className="rounded-3xl shadow-lg w-full h-[300px] sm:h-[350px] md:h-[400px] object-cover"
                                />
                            </div>
                            <div className="bg-white p-8 sm:p-12 md:p-16 rounded-3xl shadow-lg flex flex-col justify-center h-full">
                                <p className="text-[var(--primary)] font-semibold">{section.title}</p>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2">{section.heading}</h2>
                                <p className="text-gray-600 mt-4">{section.text}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-2 pb-20">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-6 sm:p-12 rounded-3xl shadow-md text-center">
                            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--primary)] pb-1">
                                {stat.value}
                            </h3>
                            <p className="text-gray-500">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-6 py-16 text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Náš tým</h2>
                <p className="text-lg sm:text-xl max-w-3xl mx-auto text-gray-600 mb-10">
                    Náš tým tvoří skupina nadšených odborníků, kteří se společně zaměřují na to, jak zlepšit zážitek z objednávání a doručování jídla.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
                    {teamMembers.map((member, index) => (
                        <motion.div
                            key={index}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <div className="flex flex-col items-center">
                                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl text-gray-600 mb-4">
                                    {member.name[0]}
                                </div>
                                <h3 className="text-xl font-bold">{member.academic_degree} {member.name}</h3>
                                <p className="text-[var(--primary)]">{member.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
}