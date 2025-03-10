"use client";
import { useAuth } from "@/contexts/AuthProvider";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function RestaurantForm() {
    const { user, accessToken } = useAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [formData, setFormData] = useState({
        restaurantName: "",
        restaurantType: "",
        restaurantDescription: "",
        restaurantAdress: "",
        restaurantCity: "",
        restaurantOwnerName: "",
        restaurantOwnerSurname: "",
        restaurantOwnerEmail: "",
        restaurantOwnerPhone: "",
    });

    useEffect(() => {
        if (user && user.name) {
            setIsAuthenticated(true);
            const nameParts = user.name.split(" ");
            const firstName = nameParts[0] || "";
            const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
            
            setFormData(prevData => ({
                ...prevData,
                restaurantOwnerName: firstName,
                restaurantOwnerSurname: lastName,
                restaurantOwnerEmail: user.email,
            }));
        } else {
            setIsAuthenticated(false);
        }
    }, [user]);
    
    const isFieldDisabled = (fieldName: string) => {
        if (!user || !user.name || !user.email) return false;
        
        switch (fieldName) {
            case "restaurantOwnerName": return true;
            case "restaurantOwnerSurname": return true;
            case "restaurantOwnerEmail": return true;
            default: return false;
        }
    };

    const [agreement, setAgreement] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAgreement(e.target.checked);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form data:", formData);
    };

    if (!isAuthenticated) {
        return (
            <div className="max-w-lg mx-auto bg-white py-8 px-6 rounded-2xl my-6 text-center">
                <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="rounded-full bg-orange-100 p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-12 w-12 text-orange-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Pouze pro přihlášené uživatele</h2>
                    <p className="text-gray-600 max-w-md">
                        Pro přístup k formuláři pro restaurace se prosím nejprve přihlaste ke svému účtu.
                    </p>
                    <div className="flex gap-4 mt-4">
                        <Link href="/login" className="bg-[var(--primary)] hover:bg-orange-600 text-white py-3 px-6 rounded-xl font-semibold transition">
                            Přihlásit se
                        </Link>
                        <Link href="/register" className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold transition">
                            Vytvořit účet
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8">
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-4 rounded-2xl space-y-2 max-h-[80vh] overflow-y-auto">
                <h2 className="text-3xl font-bold text-center text-gray-800">Staňte se partnerským podnikem feedy!</h2>
                <p className="text-center text-gray-600">
                    Předtím, než přijmete Vaši první objednávku, sdělte nám několik základních informací:
                </p>

                <div className="space-y-4">
                    <input
                        type="text"
                        name="restaurantName"
                        placeholder="Název podniku"
                        className="input-field"
                        onChange={handleChange}
                        value={formData.restaurantName}
                        required
                    />

                    <input
                        type="text"
                        name="restaurantDescription"
                        placeholder="Krátký popis podniku"
                        className="input-field"
                        onChange={handleChange}
                        value={formData.restaurantDescription}
                        required
                    />

                    <select name="restaurantType" className="input-field" onChange={handleChange} required value={formData.restaurantType}>
                        <option value="" disabled hidden>Vyberte typ činnosti</option>
                        <option value="typeRestaurant">Restaurace</option>
                        <option value="typeKavarna">Kavárna</option>
                        <option value="typePotraviny">Potraviny</option>
                        <option value="typeVseobecneZbozi">Všeobecné zboží</option>
                        <option value="typeDalsi">Další</option>
                    </select>

                    <input
                        type="text"
                        name="restaurantAdress"
                        placeholder="Adresa podniku"
                        className="input-field"
                        onChange={handleChange}
                        value={formData.restaurantAdress}
                        required
                    />

                    <select name="restaurantCity" className="input-field" onChange={handleChange} required value={formData.restaurantCity}>
                        <option value="" disabled hidden>Vyberte město</option>
                        <option value="Praha">Praha</option>
                        <option value="Brno">Brno</option>
                        <option value="Zlín">Zlín</option>
                    </select>

                    <input
                        type="text"
                        name="restaurantOwnerName"
                        placeholder="Jméno"
                        className={`input-field ${isFieldDisabled("restaurantOwnerName") ? "bg-gray-100" : ""}`}
                        onChange={handleChange}
                        value={formData.restaurantOwnerName}
                        disabled={isFieldDisabled("restaurantOwnerName")}
                        required
                    />
                    <input
                        type="text"
                        name="restaurantOwnerSurname"
                        placeholder="Příjmení"
                        className={`input-field ${isFieldDisabled("restaurantOwnerSurname") ? "bg-gray-100" : ""}`}
                        onChange={handleChange}
                        value={formData.restaurantOwnerSurname}
                        disabled={isFieldDisabled("restaurantOwnerSurname")}
                        required
                    />
                    <input
                        type="email"
                        name="restaurantOwnerEmail"
                        placeholder="Emailová adresa"
                        className={`input-field ${isFieldDisabled("restaurantOwnerEmail") ? "bg-gray-100" : ""}`}
                        onChange={handleChange}
                        value={formData.restaurantOwnerEmail}
                        disabled={isFieldDisabled("restaurantOwnerEmail")}
                        required
                    />

                    <input 
                        type="text" 
                        name="restaurantOwnerPhone" 
                        placeholder="Telefonní číslo (vč. předvolby)" 
                        className="input-field" 
                        required 
                        onChange={handleChange}
                        value={formData.restaurantOwnerPhone} 
                    />
                </div>

                <div className="flex items-center space-x-2 mt-4 px-2">
                    <input
                        type="checkbox"
                        id="agreement"
                        className="w-5 h-5 text-[var(--primary)] border-gray-300 rounded cursor-pointer"
                        onChange={handleAgreementChange}
                        checked={agreement}
                        required
                    />
                    <label htmlFor="agreement" className="text-sm text-gray-600">
                        Souhlasím se{" "}
                        <a href="#" className="text-[var(--primary)] underline">
                            smluvními podmínkami
                        </a>{" "}
                        a beru na vědomí zpracování mých osobních údajů.
                    </label>
                </div>

                <button
                    type="submit"
                    className={`w-full py-3 rounded-xl font-semibold transition ${agreement ? "bg-[var(--primary)] hover:bg-orange-600 text-white" : "bg-gray-600 text-white cursor-not-allowed"}`}
                    disabled={!agreement}
                >
                    Odeslat
                </button>

                <style jsx>
                {`
                    .input-field {
                        width: 100%;
                        padding: 12px;
                        border: 2px solid #e5e7eb;
                        border-radius: 10px;
                        font-size: 16px;
                        transition: border-color 0.2s, background-color 0.2s;
                    }
                    .input-field:focus {
                        border-color: #9ca3af;
                        background-color: #f3f4f6;
                        outline: none;
                    }
                `}
                </style>
            </form>
        </div>
    );
}