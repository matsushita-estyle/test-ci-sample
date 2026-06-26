import { describe, expect, it } from "vitest";
import { z } from "zod";
import { addressSchema } from "./validation";

const validData = {
  postalCode: "123-4567",
  prefecture: "東京都",
  city: "渋谷区",
  streetAddress: "1-2-3",
  buildingName: "",
};

describe("addressSchema", () => {
  it("正しい住所はパスする", () => {
    expect(addressSchema.safeParse(validData).success).toBe(true);
  });

  it.each(["1234567", "123-456", "abc-defg", ""])(
    "郵便番号が不正な場合エラー: %s",
    (postalCode) => {
      const result = addressSchema.safeParse({ ...validData, postalCode });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(z.flattenError(result.error).fieldErrors.postalCode).toBeDefined();
      }
    },
  );

  it("都道府県が空の場合エラー", () => {
    const result = addressSchema.safeParse({ ...validData, prefecture: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(z.flattenError(result.error).fieldErrors.prefecture).toBeDefined();
    }
  });

  it("市区町村が空の場合エラー", () => {
    const result = addressSchema.safeParse({ ...validData, city: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(z.flattenError(result.error).fieldErrors.city).toBeDefined();
    }
  });

  it("番地が空の場合エラー", () => {
    const result = addressSchema.safeParse({ ...validData, streetAddress: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(z.flattenError(result.error).fieldErrors.streetAddress).toBeDefined();
    }
  });

  it("複数フィールドのエラーをまとめて返す", () => {
    const result = addressSchema.safeParse({
      ...validData,
      postalCode: "bad",
      prefecture: "",
      city: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;
      expect(fieldErrors.postalCode).toBeDefined();
      expect(fieldErrors.prefecture).toBeDefined();
      expect(fieldErrors.city).toBeDefined();
    }
  });

  it("建物名は省略可能", () => {
    const { buildingName: _, ...withoutBuilding } = validData;
    expect(addressSchema.safeParse(withoutBuilding).success).toBe(true);
  });
});
