import type { AddressFormData } from "./validation";

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

  return res.json() as Promise<ApiResponse>;
}
