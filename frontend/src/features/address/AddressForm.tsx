import { useState } from "react";
import type { AddressFormData, FieldError } from "./validation";
import { validateAddress } from "./validation";
import { submitAddress } from "./api";

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
        setErrors(res.errors.map((e) => ({ field: e.field as keyof AddressFormData, message: e.message })));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-label="住所入力フォーム">
      <h1>住所を入力してください</h1>

      <div>
        <label htmlFor="postalCode">郵便番号（例: 123-4567）</label>
        <input
          id="postalCode"
          name="postalCode"
          value={form.postalCode}
          onChange={handleChange}
          placeholder="123-4567"
        />
        {errorFor("postalCode") && <span role="alert">{errorFor("postalCode")}</span>}
      </div>

      <div>
        <label htmlFor="prefecture">都道府県</label>
        <input
          id="prefecture"
          name="prefecture"
          value={form.prefecture}
          onChange={handleChange}
        />
        {errorFor("prefecture") && <span role="alert">{errorFor("prefecture")}</span>}
      </div>

      <div>
        <label htmlFor="city">市区町村</label>
        <input
          id="city"
          name="city"
          value={form.city}
          onChange={handleChange}
        />
        {errorFor("city") && <span role="alert">{errorFor("city")}</span>}
      </div>

      <div>
        <label htmlFor="streetAddress">番地</label>
        <input
          id="streetAddress"
          name="streetAddress"
          value={form.streetAddress}
          onChange={handleChange}
        />
        {errorFor("streetAddress") && <span role="alert">{errorFor("streetAddress")}</span>}
      </div>

      <div>
        <label htmlFor="buildingName">建物名（任意）</label>
        <input
          id="buildingName"
          name="buildingName"
          value={form.buildingName}
          onChange={handleChange}
        />
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? "送信中..." : "送信する"}
      </button>
    </form>
  );
}
