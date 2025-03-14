"use client";
import LandingNavbar from "@/components/LandingNavbar";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthProvider";

export default function NavbarSwitcher() {
    const {user} = useAuth();

    return user ? <Navbar /> : <LandingNavbar />;
}
