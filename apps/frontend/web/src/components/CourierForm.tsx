"use client";
import { useAuth } from "@/contexts/AuthProvider";
import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import courierFormAction from "@/app/actions/courierFormAction";
import { Slide, toast } from 'react-toastify';

export default function CourierForm() {
    const { user } = useAuth();
    const [error, formAction] = useActionState(courierFormAction, undefined);

    const [formData, setFormData] = useState({
        courierFirstName: "",
        courierLastName: "",
        courierEmail: "",
        courierLanguage: "",
        courierBirthYear: "",
        courierBirthMonth: "",
        courierBirthDay: "",
        courierPhone: "",
        courierCity: "",
        courierVehicle: "",
    });

    useEffect(() => {
        if (user) {
            const [firstName, ...lastName] = user.name.split(" ");
            setFormData((prev) => ({
                ...prev,
                courierFirstName: firstName,
                courierLastName: lastName.join(" "),
                courierEmail: user.email,
            }));
        }
    }, [user]);

    const isFieldDisabled = (fieldName: string) => {
        if (!user || !user.name || !user.email) return false;

        switch (fieldName) {
            case "courierFirstName": return true;
            case "courierLastName": return true;
            case "courierEmail": return true;
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

    const validateNumberInput = (
        e: React.ChangeEvent<HTMLInputElement>,
        maxLength: number,
        maxValue: number
    ): void => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        const trimmedValue = value.slice(0, maxLength);

        if (trimmedValue && parseInt(trimmedValue) > maxValue) {
            return;
        }

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
            <h2 className="text-3xl font-bold text-center text-gray-800">Staňte se partnerským kurýrem feedy!</h2>
            <p className="text-center text-gray-600">
                Předtím, než přijmete Vaši první objednávku, sdělte nám několik základních informací:
            </p>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="space-y-4 px-4">
                <input
                    type="text"
                    name="courierFirstName"
                    placeholder="Jméno"
                    className={`input-field ${isFieldDisabled("courierFirstName") ? "bg-gray-100" : ""}`}
                    onChange={handleChange}
                    value={formData.courierFirstName}
                    disabled={isFieldDisabled("courierFirstName")}
                    required
                />
                <input
                    type="text"
                    name="courierLastName"
                    placeholder="Příjmení"
                    className={`input-field ${isFieldDisabled("courierLastName") ? "bg-gray-100" : ""}`}
                    onChange={handleChange}
                    value={formData.courierLastName}
                    disabled={isFieldDisabled("courierLastName")}
                    required
                />
                <input
                    type="email"
                    name="courierEmail"
                    placeholder="Emailová adresa"
                    className={`input-field ${isFieldDisabled("courierEmail") ? "bg-gray-100" : ""}`}
                    onChange={handleChange}
                    value={formData.courierEmail}
                    disabled={isFieldDisabled("courierEmail")}
                    required
                />

                <select name="courierLanguage" className="input-field" onChange={handleChange} required value={formData.courierLanguage}>
                    <option value="" disabled hidden>Vyberte jazyk</option>
                    <option value="Czech">Čeština</option>
                    <option value="Slovak">Slovenština</option>
                    <option value="English">Angličtina</option>
                    <option value="German">Němčina</option>
                </select>

                <div className="flex space-x-4">
                    <input
                        type="text"
                        name="courierBirthYear"
                        placeholder="RRRR"
                        className="input-field w-1/3"
                        value={formData.courierBirthYear || ''}
                        onChange={(e) => validateNumberInput(e, 4, 9999)}
                        inputMode="numeric"
                        maxLength={4}
                    />
                    <input
                        type="text"
                        name="courierBirthMonth"
                        placeholder="MM"
                        className="input-field w-1/3"
                        value={formData.courierBirthMonth || ''}
                        onChange={(e) => validateNumberInput(e, 2, 12)}
                        inputMode="numeric"
                        maxLength={2}
                    />
                    <input
                        type="text"
                        name="courierBirthDay"
                        placeholder="DD"
                        className="input-field w-1/3"
                        value={formData.courierBirthDay || ''}
                        onChange={(e) => validateNumberInput(e, 2, 31)}
                        inputMode="numeric"
                        maxLength={2}
                    />
                </div>

                <select name="courierCity" className="input-field" onChange={handleChange} required defaultValue={formData.courierCity}>
                    <option value="" disabled>Vyberte město</option>
                    <option value="Praha">Praha</option>
                    <option value="Brno">Brno</option>
                    <option value="Zlín">Zlín</option>
                </select>

                <select name="courierVehicle" className="input-field" onChange={handleChange} required value={formData.courierVehicle}>
                    <option value="" disabled>Vyberte dopravní prostředek</option>
                    <option value="Bicycle">Kolo</option>
                    <option value="ElectricBicycle">Elektrokolo</option>
                    <option value="Car">Auto</option>
                    <option value="ElectricScooter">Elektronický skútr</option>
                </select>
            </div>

            <div className="flex items-center space-x-2 mt-4 px-4">
                <input
                    type="checkbox"
                    id="courierAgreement"
                    className="w-5 h-5 text-[var(--primary)] border-gray-300 rounded cursor-pointer"
                    onChange={handleAgreementChange}
                    required
                />
                <label htmlFor="agreement" className="text-sm text-gray-600">
                    Souhlasím se{" "}
                    <Link href="/terms" className="text-[var(--primary)] underline">smluvními podmínkami</Link>{" "}
                    a beru na vědomí zpracování mých osobních údajů.
                </label>
            </div>

            <div className="px-4 mt-4">
                <button
                    type="submit"
                    className={`w-full py-3 rounded-full font-semibold transition 
                    ${agreement ? "bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white" : "bg-gray-600 text-white cursor-not-allowed"}`}
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