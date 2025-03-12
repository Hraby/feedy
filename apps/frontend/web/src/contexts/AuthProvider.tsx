"use client";
import { createContext, useContext, ReactNode } from "react";
import { useAccessToken } from "@/hooks/useAuth";

export interface User {
    id: string;
    name: string;
    role: string[];
    email: string;
}

const AuthContext = createContext<{ user: User | null; accessToken: string | null }>({ user: null, accessToken: null });

export function AuthProvider({ children, user }: { children: ReactNode; user: User | null }) {
    const accessToken = useAccessToken();

    return (
        <AuthContext.Provider value={{ user, accessToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}