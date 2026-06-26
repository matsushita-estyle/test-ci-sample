export type AddressFormData = {
  postalCode: string;
  prefecture: string;
  city: string;
  streetAddress: string;
  buildingName: string;
};

export type FieldError = {
  field: keyof AddressFormData;
  message: string;
};

const POSTAL_CODE_PATTERN = /^\d{3}-\d{4}$/;

export function validateAddress(data: AddressFormData): FieldError[] {
  const errors: FieldError[] = [];

  if (!POSTAL_CODE_PATTERN.test(data.postalCode)) {
    errors.push({ field: "postalCode", message: "郵便番号は 000-0000 の形式で入力してください" });
  }
  if (!data.prefecture.trim()) {
    errors.push({ field: "prefecture", message: "都道府県を入力してください" });
  }
  if (!data.city.trim()) {
    errors.push({ field: "city", message: "市区町村を入力してください" });
  }
  if (!data.streetAddress.trim()) {
    errors.push({ field: "streetAddress", message: "番地を入力してください" });
  }

  return errors;
}
