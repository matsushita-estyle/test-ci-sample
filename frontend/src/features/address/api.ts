import type { AddressFormData } from "./validation";

type RawAddress = {
  postal_code: string;
  prefecture: string;
  city: string;
  street_address: string;
  building_name: string;
};

type RawApiResponse =
  | { valid: true; address: RawAddress }
  | { valid: false; errors: { field: string; message: string }[] };

export type ApiResponse =
  | { valid: true; address: AddressFormData }
  | { valid: false; errors: { field: string; message: string }[] };

export async function submitAddress(data: AddressFormData): Promise<ApiResponse> {
  const res = await fetch("/api/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      postal_code: data.postalCode,
      prefecture: data.prefecture,
      city: data.city,
      street_address: data.streetAddress,
      building_name: data.buildingName,
    }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const raw = (await res.json()) as RawApiResponse;
  if (!raw.valid) return raw;

  return {
    valid: true,
    address: {
      postalCode: raw.address.postal_code,
      prefecture: raw.address.prefecture,
      city: raw.address.city,
      streetAddress: raw.address.street_address,
      buildingName: raw.address.building_name,
    },
  };
}
