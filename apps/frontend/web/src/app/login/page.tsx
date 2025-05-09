"use client";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { useActionState } from "react";
import loginAction from "./loginAction";

export default function Login() {
    const [error, formAction] = useActionState(loginAction, undefined);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] p-4">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
                <h2 className="text-4xl font-bold text-center text-gray-800">Přihlášení</h2>
                <p className="text-center text-gray-600 mt-2">Přihlaste se ke svému účtu</p>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mt-4" role="alert">
                        <strong className="font-bold">Chyba!</strong>
                        <span className="block sm:inline ml-1">{error}</span>
                    </div>
                )}

                <form action={formAction} className="mt-6 space-y-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Emailová adresa"
                        className="input-field"
                        required
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Heslo"
                            className="input-field pr-12"
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onMouseDown={() => setShowPassword(true)}
                            onMouseUp={() => setShowPassword(false)}
                            onMouseLeave={() => setShowPassword(false)}
                        >
                            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                    </div>

                    <button type="submit" className="w-full py-3 rounded-xl bg-[var(--primary)] hover:bg-orange-600 text-white font-semibold transition">
                        Přihlásit se
                    </button>
                </form>

                <p className="text-center text-gray-600 text-sm mt-4">
                    Nemáte účet? {" "}
                    <Link href="/register" className="text-[var(--primary)] underline">Registrujte se</Link>
                </p>
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
        </div>
    );
}
