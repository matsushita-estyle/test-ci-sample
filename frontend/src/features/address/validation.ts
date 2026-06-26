import { z } from "zod";

export const addressSchema = z.object({
  postalCode: z
    .string()
    .regex(/^\d{3}-\d{4}$/, "郵便番号は 000-0000 の形式で入力してください"),
  prefecture: z.string().min(1, "都道府県を入力してください"),
  city: z.string().min(1, "市区町村を入力してください"),
  streetAddress: z.string().min(1, "番地を入力してください"),
  buildingName: z.string().optional(),
});

export type AddressFormData = z.infer<typeof addressSchema>;
