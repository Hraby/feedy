"use server";

import { updateAddress } from "@/lib/session";

export async function setDeliveryAddress(address: { street: string; city: string; zipCode: string; country: string }) {
  await updateAddress(address);

  return { success: true };
}
