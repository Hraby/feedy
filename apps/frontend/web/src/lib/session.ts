"use server";

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

export type Session = {
  user: {
    id: string;
    name: string;
    role: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
  address?: AddressPayload;
};

export type AddressPayload = {
  street: string;
  city: string;
  zipCode: string;
  country: string;
};

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY!);

export async function createSession(payload: Omit<Session, "address">, address?: AddressPayload) {
  const expire = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const cookieStore = await cookies();

  const sessionData: Session = {
    ...payload,
    address: address || undefined,
  };

  const session = await new SignJWT(sessionData)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expire,
    sameSite: "lax",
    path: "/",
  });
}

export async function updateAddress(address: AddressPayload) {
  const session = await getSession();
  if (!session) return;

  await createSession(
    {
      user: session.user,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    },
    address
  );
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("session")?.value;
  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify(cookie, SECRET_KEY, { algorithms: ["HS256"] });
    return payload as Session;
  } catch (error) {
    console.log("Invalid session", error);
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function updateTokens(accessToken: string, refreshToken: string) {
  const session = await getSession();
  if (!session) return null;

  await createSession(
    {
      user: session.user,
      accessToken,
      refreshToken,
    },
    session.address // Zachová adresu
  );
}

export async function getUser() {
  const session = await getSession();
  return session?.user;
}