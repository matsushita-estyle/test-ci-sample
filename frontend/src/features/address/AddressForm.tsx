import { useState } from "react";
import { submitAddress } from "./api";
import { FormField } from "./FormField";
import type { AddressFormData, FieldError } from "./validation";
import { validateAddress } from "./validation";

type Props = {
  onComplete: (address: AddressFormData) => void;
};

const INITIAL: AddressFormData = {
  postalCode: "",
  prefecture: "",
  city: "",
  streetAddress: "",
  buildingName: "",
};

export function AddressForm({ onComplete }: Props) {
  const [form, setForm] = useState<AddressFormData>(INITIAL);
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const errorFor = (field: keyof AddressFormData) =>
    errors.find((e) => e.field === field)?.message;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clientErrors = validateAddress(form);
    if (clientErrors.length > 0) {
      setErrors(clientErrors);
      return;
    }
    setErrors([]);
    setSubmitting(true);
    try {
      const res = await submitAddress(form);
      if (res.valid) {
        onComplete(form);
      } else {
        setErrors(
          res.errors.map((e) => ({
            field: e.field as keyof AddressFormData,
            message: e.message,
          })),
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-left">
        <h1 className="card-title">住所入力フォーム</h1>
        <p className="card-subtitle">
          配送先の住所を入力してください。
          <br />
          郵便番号・都道府県・市区町村・番地は必須項目です。
        </p>
      </div>

      <div className="card-right">
        <form onSubmit={handleSubmit} aria-label="住所入力フォーム">
          <div className="form-grid">
            <FormField
              id="postalCode"
              label="郵便番号"
              value={form.postalCode}
              onChange={handleChange}
              placeholder="123-4567"
              error={errorFor("postalCode")}
            />
            <FormField
              id="prefecture"
              label="都道府県"
              value={form.prefecture}
              onChange={handleChange}
              placeholder="東京都"
              error={errorFor("prefecture")}
            />
            <FormField
              id="city"
              label="市区町村"
              value={form.city}
              onChange={handleChange}
              placeholder="渋谷区"
              error={errorFor("city")}
            />
            <FormField
              id="streetAddress"
              label="番地"
              value={form.streetAddress}
              onChange={handleChange}
              placeholder="1-2-3"
              error={errorFor("streetAddress")}
            />
            <FormField
              id="buildingName"
              label="建物名（任意）"
              value={form.buildingName}
              onChange={handleChange}
              placeholder="○○ビル 3F"
              fullWidth
            />
          </div>

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "送信中..." : "送信する"}
          </button>
        </form>
      </div>
    </div>
  );
}
