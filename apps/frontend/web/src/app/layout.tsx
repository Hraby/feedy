import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
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
        <AuthProvider user={session ? { id: session.id, name: session.name, role: session.role } : null}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
