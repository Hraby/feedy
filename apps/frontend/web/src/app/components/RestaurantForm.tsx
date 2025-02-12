"use client";
import { useState } from "react";

export default function RestaurantForm() {
    const [formData, setFormData] = useState({
        restaurantName: "",
        restaurantType: "",
        restaurantDescription: "",
        restaurantAdress: "",
        restaurantCity: "",
        RestaurantOwnerName: "",
        RestaurantOwnerSurname: "",
        RestaurantOwnerPhone: "",
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
                    required
                />

                <input
                    type="text"
                    name="restaurantDescription"
                    placeholder="Krátký popis podniku"
                    className="input-field"
                    onChange={handleChange}
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
                    name="RestaurantOwnerName"
                    placeholder="Jméno"
                    className="input-field"
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="RestaurantOwnerSurname"
                    placeholder="Příjmení"
                    className="input-field"
                    onChange={handleChange}
                    required
                />
                <input type="text" name="RestaurantOwnerPhone" placeholder="Telefonní číslo (vč. předvolby)" className="input-field" required onChange={handleChange} />
            </div>

            <div className="flex items-center space-x-2 mt-4 px-2">
                <input
                    type="checkbox"
                    id="agreement"
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
