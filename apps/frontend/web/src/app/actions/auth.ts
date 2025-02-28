'use server'

import { deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function signOut() {
  await deleteSession();
  redirect('/login');
}