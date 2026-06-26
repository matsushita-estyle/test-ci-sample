import { useState } from "react";
import { AddressForm } from "./features/address/AddressForm";
import { CompletionScreen } from "./features/address/CompletionScreen";
import type { AddressFormData } from "./features/address/validation";

export function App() {
  const [completed, setCompleted] = useState<AddressFormData | null>(null);

  if (completed) {
    return <CompletionScreen address={completed} onBack={() => setCompleted(null)} />;
  }

  return <AddressForm onComplete={setCompleted} />;
}
