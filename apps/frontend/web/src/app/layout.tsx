import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthProvider";
import { getSession } from "@/lib/session";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Doručení rychlostí blesku | feedy.",
  description: "Food delivery platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession()
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider address={session?.address ? {street: session.address.street, city: session.address.city, country: session.address.country, zipCode: session.address.zipCode}: null} user={session ? { id: session.user.id, name: session.user.name, role: Array.isArray(session.user.role) ? session.user.role : [session.user.role], email: session.user.email } : null}>
            {children}
        </AuthProvider>
      </body>
    </html>
  );
}
