import { useState } from "react";
import { submitAddress } from "./api";
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
      <h1 className="card-title">住所入力</h1>
      <p className="card-subtitle">フォームに住所を入力して送信してください</p>

      <form onSubmit={handleSubmit} aria-label="住所入力フォーム">
        <div className="form-grid">
          {/* 郵便番号：左半分 */}
          <div className="field">
            <label htmlFor="postalCode">郵便番号</label>
            <input
              id="postalCode"
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              placeholder="123-4567"
            />
            {errorFor("postalCode") && (
              <span className="field-error" role="alert">
                {errorFor("postalCode")}
              </span>
            )}
          </div>

          {/* 都道府県：右半分 */}
          <div className="field">
            <label htmlFor="prefecture">都道府県</label>
            <input
              id="prefecture"
              name="prefecture"
              value={form.prefecture}
              onChange={handleChange}
              placeholder="東京都"
            />
            {errorFor("prefecture") && (
              <span className="field-error" role="alert">
                {errorFor("prefecture")}
              </span>
            )}
          </div>

          {/* 市区町村：左半分 */}
          <div className="field">
            <label htmlFor="city">市区町村</label>
            <input
              id="city"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="渋谷区"
            />
            {errorFor("city") && (
              <span className="field-error" role="alert">
                {errorFor("city")}
              </span>
            )}
          </div>

          {/* 番地：右半分 */}
          <div className="field">
            <label htmlFor="streetAddress">番地</label>
            <input
              id="streetAddress"
              name="streetAddress"
              value={form.streetAddress}
              onChange={handleChange}
              placeholder="1-2-3"
            />
            {errorFor("streetAddress") && (
              <span className="field-error" role="alert">
                {errorFor("streetAddress")}
              </span>
            )}
          </div>

          {/* 建物名：全幅 */}
          <div className="field field-full">
            <label htmlFor="buildingName">建物名（任意）</label>
            <input
              id="buildingName"
              name="buildingName"
              value={form.buildingName}
              onChange={handleChange}
              placeholder="○○ビル 3F"
            />
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? "送信中..." : "送信する"}
        </button>
      </form>
    </div>
  );
}
