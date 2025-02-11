"use client";
import { useState } from "react";

export default function CourierForm() {
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

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-4 rounded-2xl space-y-2">
            <h2 className="text-3xl font-bold text-center text-gray-800">Staňte se partnerským kurýrem feedy!</h2>
            <p className="text-center text-gray-600">
                Předtím, než přijmete Vaši první objednávku, sdělte nám několik základních informací:
            </p>

            <div className="space-y-4">
                <input
                    type="text"
                    name="courierFirstName"
                    placeholder="Křestní jméno"
                    className="input-field"
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="courierLastName"
                    placeholder="Příjmení"
                    className="input-field"
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="courierEmail"
                    placeholder="Emailová adresa"
                    className="input-field"
                    onChange={handleChange}
                    required
                />

                <select name="courierLanguage" className="input-field" onChange={handleChange} required value={formData.courierLanguage}>
                    <option value="" disabled hidden>Vyberte jazyk</option>
                    <option value="čeština">Čeština</option>
                    <option value="slovenština">Slovenština</option>
                    <option value="angličtina">Angličtina</option>
                    <option value="němčina">Němčina</option>
                </select>

                <div className="flex space-x-4">
                    <input type="text" name="courierBirthYear" placeholder="RRRR" className="input-field w-1/3" onChange={handleChange} />
                    <input type="text" name="courierBirthMonth" placeholder="MM" className="input-field w-1/3" onChange={handleChange} />
                    <input type="text" name="courierBirthDay" placeholder="DD" className="input-field w-1/3" onChange={handleChange} />
                </div>

                <input type="text" name="courierPhone" placeholder="Telefonní číslo (vč. předvolby)" className="input-field" required onChange={handleChange} />

                <select name="courierCity" className="input-field" onChange={handleChange} required value={formData.courierCity}>
                    <option value="" disabled hidden>Vyberte město</option>
                    <option value="Praha">Praha</option>
                    <option value="Brno">Brno</option>
                    <option value="Zlín">Zlín</option>
                </select>

                <select name="courierVehicle" className="input-field" onChange={handleChange} required value={formData.courierVehicle}>
                    <option value="" disabled hidden>Vyberte dopravní prostředek</option>
                    <option value="kolo">Kolo</option>
                    <option value="elektrokolo">Elektrokolo</option>
                    <option value="auto">Auto</option>
                    <option value="elektronický skútr">Elektronický skútr</option>
                </select>
            </div>

            <div className="flex items-center space-x-2 mt-4 px-2">
                <input
                    type="checkbox"
                    id="courierAgreement"
                    className="w-5 h-5 text-[var(--primary)] border-gray-300 rounded cursor-pointer"
                    onChange={handleAgreementChange}
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
                className={`w-full py-3 rounded-xl font-semibold transition 
        ${agreement ? "bg-[var(--primary)] hover:bg-orange-600 text-white" : "bg-gray-600 text-white cursor-not-allowed"}`}
                disabled={!agreement}
            >
                Odeslat
            </button>

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
