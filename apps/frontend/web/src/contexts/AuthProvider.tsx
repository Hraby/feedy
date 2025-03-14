"use client";
import { createContext, useContext, ReactNode } from "react";
import { useAccessToken } from "@/hooks/useAuth";
import { AddressPayload } from "@/lib/session";

export interface User {
    id: string;
    name: string;
    role: string[];
    email: string;
}

const AuthContext = createContext<{ user: User | null; accessToken: string | null; address: AddressPayload | null }>({ user: null, accessToken: null, address: null });

export function AuthProvider({ children, user, address }: { children: ReactNode; user: User | null; address: AddressPayload | null }) {
    const accessToken = useAccessToken();

    return (
        <AuthContext.Provider value={{ user, accessToken, address }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}