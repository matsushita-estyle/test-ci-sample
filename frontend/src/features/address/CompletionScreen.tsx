import type { AddressFormData } from "./validation";

type Props = {
  address: AddressFormData;
  onBack: () => void;
};

export function CompletionScreen({ address, onBack }: Props) {
  return (
    <div>
      <h1>送信完了</h1>
      <p>以下の住所を受け付けました。</p>
      <dl>
        <dt>郵便番号</dt>
        <dd>{address.postalCode}</dd>
        <dt>都道府県</dt>
        <dd>{address.prefecture}</dd>
        <dt>市区町村</dt>
        <dd>{address.city}</dd>
        <dt>番地</dt>
        <dd>{address.streetAddress}</dd>
        {address.buildingName && (
          <>
            <dt>建物名</dt>
            <dd>{address.buildingName}</dd>
          </>
        )}
      </dl>
      <button type="button" onClick={onBack}>
        入力に戻る
      </button>
    </div>
  );
}
