"use client";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";

export default function Register() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordAgain: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordAgain, setShowPasswordAgain] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        if (e.target.name === "passwordAgain") {
            if (e.target.value !== formData.password) {
                setError("Hesla se neshodují!");
            } else {
                setError("");
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.passwordAgain) {
            setError("Hesla se neshodují!");
            return;
        }
        console.log("Register data:", formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] p-4">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
                <h2 className="text-4xl font-bold text-center text-gray-800">Registrace</h2>
                <p className="text-center text-gray-600 mt-2">Zaregistrujte se na platformě Feedy</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <input
                        type="text"
                        name="firstName"
                        placeholder="Jméno"
                        className="input-field"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Příjmení"
                        className="input-field"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Emailová adresa"
                        className="input-field"
                        onChange={handleChange}
                        required
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Heslo"
                            className="input-field pr-12"
                            onChange={handleChange}
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

                    <div className="relative">
                        <input
                            type={showPasswordAgain ? "text" : "password"}
                            name="passwordAgain"
                            placeholder="Heslo znovu"
                            className="input-field pr-12"
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onMouseDown={() => setShowPasswordAgain(true)}
                            onMouseUp={() => setShowPasswordAgain(false)}
                            onMouseLeave={() => setShowPasswordAgain(false)}
                        >
                            {showPasswordAgain ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                    </div>

                    {error && <p className="text-red-500 text-md text-center">{error}</p>}

                    <div className="flex items-center space-x-2 mt-4 px-2">
                        <input
                            type="checkbox"
                            id="agreement"
                            className="w-5 h-5 text-[var(--primary)] border-gray-300 rounded cursor-pointer"
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
                        className="w-full py-3 rounded-xl bg-[var(--primary)] hover:bg-orange-600 text-white font-semibold transition"
                    >
                        Registrovat se
                    </button>
                </form>

                <p className="text-center text-gray-600 text-sm mt-4">
                    Máte již vytvořený účet?{" "}
                    <Link href="/login" className="text-[var(--primary)] underline">
                        Přihlaste se
                    </Link>
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
