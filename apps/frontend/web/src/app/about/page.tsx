'use client';
import NavbarSwitcher from "@/components/NavbarSwitch";
import Footer from "@/components/Footer";

export default function About() {
    return (
        <div>
            <div className="flex flex-col min-h-screen">
                <NavbarSwitcher />
                <div className="container mx-auto px-4 flex-grow">
                    <h1 className="text-4xl font-bold mb-2 text-center">Feedy</h1>

                    <p className="mb-4 text-center">
                        Vítejte ve službě Feedy!
                    </p>

                    
                </div>
                <Footer />
            </div>
        </div>
    );
}