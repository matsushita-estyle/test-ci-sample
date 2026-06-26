import { describe, expect, it } from "vitest";
import { type AddressFormData, validateAddress } from "./validation";

const validData: AddressFormData = {
  postalCode: "123-4567",
  prefecture: "東京都",
  city: "渋谷区",
  streetAddress: "1-2-3",
  buildingName: "",
};

describe("validateAddress", () => {
  it("正しい住所ではエラーなし", () => {
    expect(validateAddress(validData)).toEqual([]);
  });

  it.each(["1234567", "123-456", "abc-defg", ""])(
    "郵便番号が不正な場合エラー: %s",
    (postalCode) => {
      const errors = validateAddress({ ...validData, postalCode });
      expect(errors.map((e) => e.field)).toContain("postalCode");
    },
  );

  it("都道府県が空の場合エラー", () => {
    const errors = validateAddress({ ...validData, prefecture: "" });
    expect(errors.map((e) => e.field)).toContain("prefecture");
  });

  it("市区町村が空の場合エラー", () => {
    const errors = validateAddress({ ...validData, city: "" });
    expect(errors.map((e) => e.field)).toContain("city");
  });

  it("番地が空の場合エラー", () => {
    const errors = validateAddress({ ...validData, streetAddress: "" });
    expect(errors.map((e) => e.field)).toContain("streetAddress");
  });

  it("複数のエラーをまとめて返す", () => {
    const errors = validateAddress({ ...validData, postalCode: "bad", prefecture: "", city: "" });
    expect(errors).toHaveLength(3);
  });
});
