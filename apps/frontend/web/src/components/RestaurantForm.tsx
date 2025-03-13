"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import Link from "next/link";
import restaurantFormAction from "@/app/actions/restaurantFormAction";

export default function RestaurantForm() {
    const { user } = useAuth();
    const [error, formAction] = useActionState(restaurantFormAction, undefined);
    const [agreement, setAgreement] = useState(false);

    const [formData, setFormData] = useState({
        restaurantName: "",
        restaurantType: "",
        restaurantDescription: "",
        restaurantAddress: "",
        restaurantCity: "",
        restaurantCategory: [] as string[],
        restaurantOwnerName: "",
        restaurantOwnerSurname: "",
        restaurantOwnerEmail: "",
        restaurantOwnerPhone: "",
    });

    useEffect(() => {
        if (user) {
            const [firstName, ...lastName] = user.name.split(" ");
            setFormData((prev) => ({
                ...prev,
                restaurantOwnerName: firstName,
                restaurantOwnerSurname: lastName.join(" "),
                restaurantOwnerEmail: user.email,
            }));
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, multiple, selectedOptions } = e.target as HTMLSelectElement;
    
        setFormData({
            ...formData,
            [name]: multiple ? Array.from(selectedOptions, option => option.value) : value,
        });

    };
    

    const isFieldDisabled = (fieldName: string) => {
        if (!user || !user.name || !user.email) return false;
        
        switch (fieldName) {
            case "courierFirstName": return true;
            case "courierLastName": return true;
            case "courierEmail": return true;
            default: return false;
        }
    };
    
    const validatePhoneInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value.replace(/[^\d+() -]/g, '');
        const trimmedValue = value.slice(0, 20);

        setFormData(prev => ({ ...prev, [e.target.name]: trimmedValue }));
    };

    if (!user) {
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
                        Pro přístup k formuláři pro kurýry se prosím nejprve přihlaste ke svému účtu.
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
            <form action={formAction} className="max-w-lg mx-auto bg-white py-4 rounded-2xl space-y-2 my-6 max-h-[80vh] overflow-y-auto">
                <h2 className="text-3xl font-bold text-center text-gray-800">Staňte se partnerským podnikem</h2>
                <p className="text-center text-gray-600 max-w-md">
                    Pro přístup k formuláři pro restaurace se prosím nejprve přihlaste ke svému účtu.
                </p>
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="space-y-4 px-4">

                    <input type="text" name="restaurantName" placeholder="Název podniku" className="input-field" onChange={handleChange} defaultValue={formData.restaurantName} required />
                    <input type="text" name="restaurantDescription" placeholder="Popis podniku" className="input-field" onChange={handleChange} defaultValue={formData.restaurantDescription} required />

                    <select name="restaurantType" className="input-field" onChange={handleChange} defaultValue={formData.restaurantType} required>
                        <option value="" disabled>Vyberte typ</option>
                        <option value="restaurant">Restaurace</option>
                        <option value="cafe">Kavárna</option>
                        <option value="grocery">Potraviny</option>
                    </select>

                    <input type="text" name="restaurantAddress" placeholder="Adresa" className="input-field" onChange={handleChange} defaultValue={formData.restaurantAddress} required />
                    
                    <select name="restaurantCity" className="input-field" onChange={handleChange} required value={formData.restaurantCity}>
                        <option value="" disabled>Vyberte město</option>
                        <option value="Praha">Praha</option>
                        <option value="Brno">Brno</option>
                        <option value="Zlín">Zlín</option>
                    </select>

                    <div className="flex flex-wrap gap-2">
                    {["Burger", "Kuřecí", "Pizza", "Čína", "Snídaně", "Sushi", "Salát", "Sladké", "Slané"].map((category) => (
                        <label key={category} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="restaurantCategory"
                                value={category}
                                checked={formData.restaurantCategory.includes(category)}
                                onChange={(e) => {
                                const { value, checked } = e.target;
                                setFormData((prevData) => ({
                                    ...prevData,
                                    restaurantCategory: checked
                                    ? [...prevData.restaurantCategory, value]
                                    : prevData.restaurantCategory.filter((c) => c !== value),
                                }));
                                }}
                                className="hidden"
                            />
                            <div className={`px-4 py-2 border rounded-lg ${formData.restaurantCategory.includes(category) ? "bg-orange-500 text-white" : "bg-gray-200 text-black"}`}>
                                {category}
                            </div>
                        </label>
                    ))}
                    </div>

                    <input type="text" name="restaurantOwnerName" placeholder="Jméno" className={`input-field ${isFieldDisabled("courierFirstName") ? "bg-gray-100" : ""}`} disabled={isFieldDisabled("restaurantOwnerName")} defaultValue={formData.restaurantOwnerName} required />
                    <input type="text" name="restaurantOwnerSurname" placeholder="Příjmení" className={`input-field ${isFieldDisabled("courierFirstName") ? "bg-gray-100" : ""}`} disabled={isFieldDisabled("restaurantOwnerSurname")} defaultValue={formData.restaurantOwnerSurname} required />
                    <input type="email" name="restaurantOwnerEmail" placeholder="Email" className={`input-field ${isFieldDisabled("courierFirstName") ? "bg-gray-100" : ""}`} disabled={isFieldDisabled("restaurantOwnerEmail")} defaultValue={formData.restaurantOwnerEmail} required />
                    <input 
                        type="tel" 
                        name="restaurantOwnerPhone" 
                        placeholder="Telefonní číslo (vč. předvolby)" 
                        className="input-field" 
                        required 
                        value={formData.restaurantOwnerPhone || ''}
                        onChange={validatePhoneInput}
                        inputMode="tel"
                    />
                </div>

                <div className="flex items-center space-x-2 mt-4 px-4">
                    <input type="checkbox" id="agreement" className="w-5 h-5 text-[var(--primary)] border-gray-300 rounded cursor-pointer" onChange={(e) => setAgreement(e.target.checked)} checked={agreement} required />
                    <label htmlFor="agreement" className="text-sm text-gray-600">
                        Souhlasím se{" "}
                        <a href="#" className="text-[var(--primary)] underline">
                            smluvními podmínkami
                        </a>{" "}
                        a beru na vědomí zpracování mých osobních údajů.
                    </label>
                </div>

                <div className="px-4 mt-4">
                    <button
                        type="submit"
                        className={`w-full py-3 rounded-xl font-semibold transition 
                        ${agreement ? "bg-[var(--primary)] hover:bg-orange-600 text-white" : "bg-gray-600 text-white cursor-not-allowed"}`}
                        disabled={!agreement}
                    >
                        Odeslat
                    </button>
                </div>


                <style jsx>{`
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
                `}</style>
            </form>
    );
}
