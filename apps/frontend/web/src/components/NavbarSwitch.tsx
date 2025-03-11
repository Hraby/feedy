"use client";
import LandingNavbar from "@/components/LandingNavbar";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthProvider";

export default function NavbarSwitcher() {
    const {user, accessToken} = useAuth();

    return user ? <Navbar /> : <LandingNavbar />;
}
