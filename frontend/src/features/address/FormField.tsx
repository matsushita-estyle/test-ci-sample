import type { UseFormRegisterReturn } from "react-hook-form";

type Props = {
  id: string;
  label: string;
  registration: UseFormRegisterReturn;
  placeholder?: string;
  error?: string;
  fullWidth?: boolean;
};

export function FormField({ id, label, registration, placeholder, error, fullWidth }: Props) {
  return (
    <div className={`field${fullWidth ? " field-full" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <input id={id} placeholder={placeholder} {...registration} />
      {error && (
        <span className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
