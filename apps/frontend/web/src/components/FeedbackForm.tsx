"use client";
import { useAuth } from "@/contexts/AuthProvider";
import { useState } from "react";
import Link from "next/link";
import { toast, Slide } from 'react-toastify';

export default function FeedbackForm() {
    const { user } = useAuth();
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        toast.success("Feedback byl úspěšně odeslán!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Slide,
      });
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
                        Pro přístup k formuláři pro zpětnou vazbu se prosím nejprve přihlaste ke svému účtu.
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

    if (submitted) {
        return (
            <div className="max-w-lg mx-auto bg-white py-8 px-6 rounded-2xl my-6 text-center">
                <h2 className="text-4xl font-bold text-green-500">Feedback byl odeslán!</h2>
                <p className="text-gray-600 mt-2">Děkujeme za vaši zpětnou vazbu.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white py-4 rounded-2xl space-y-2 my-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800">Jak probíhalo doručení?</h2>
            <p className="text-center text-gray-600">
                Vaše zpětná vazba nám pomáhá zlepšit naše služby.
            </p>

            <div className="space-y-4 px-4 py-4">
                <textarea name="reviewDescription" placeholder="Vaše hodnocení" className="input-field" rows={5} required />

                <select name="reviewRating" className="input-field" required defaultValue="">
                    <option value="" disabled hidden>Vyberte celkové hodnocení</option>
                    <option value="1">⭐</option>
                    <option value="2">⭐⭐</option>
                    <option value="3">⭐⭐⭐</option>
                    <option value="4">⭐⭐⭐⭐</option>
                    <option value="5">⭐⭐⭐⭐⭐</option>
                </select>
            </div>

            <div className="px-4 mt-4">
                <button
                    type="submit"
                    className={"w-full py-3 rounded-full font-semibold transition bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white"}
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
