import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { submitAddress } from "./api";
import { FormField } from "./FormField";
import { type AddressFormData, addressSchema } from "./validation";

type Props = {
  onComplete: (address: AddressFormData) => void;
};

export function AddressForm({ onComplete }: Props) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormData>({ resolver: zodResolver(addressSchema) });

  const onSubmit = async (data: AddressFormData) => {
    const res = await submitAddress(data);
    if (res.valid) {
      onComplete(data);
    } else {
      for (const e of res.errors) {
        setError(e.field as keyof AddressFormData, { message: e.message });
      }
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
        <form onSubmit={handleSubmit(onSubmit)} aria-label="住所入力フォーム">
          <div className="form-grid">
            <FormField
              id="postalCode"
              label="郵便番号"
              registration={register("postalCode")}
              placeholder="123-4567"
              error={errors.postalCode?.message}
            />
            <FormField
              id="prefecture"
              label="都道府県"
              registration={register("prefecture")}
              placeholder="東京都"
              error={errors.prefecture?.message}
            />
            <FormField
              id="city"
              label="市区町村"
              registration={register("city")}
              placeholder="渋谷区"
              error={errors.city?.message}
            />
            <FormField
              id="streetAddress"
              label="番地"
              registration={register("streetAddress")}
              placeholder="1-2-3"
              error={errors.streetAddress?.message}
            />
            <FormField
              id="buildingName"
              label="建物名（任意）"
              registration={register("buildingName")}
              placeholder="○○ビル 3F"
              fullWidth
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "送信中..." : "送信する"}
          </button>
        </form>
      </div>
    </div>
  );
}
