# CI サンプル — TypeScript + Python

TypeScript（フロントエンド）と Python（バックエンド）の組み合わせで CI がどう動くかを示すサンプルです。  
住所入力フォーム → 完了画面の 2 画面構成で、Docker 不要で動かせます。

## このサンプルで示すもの

| ツール | 役割 |
|---|---|
| **biome** | TypeScript の lint / format |
| **tsc** | TypeScript の型チェック |
| **vitest** | TypeScript のユニットテスト |
| **Playwright** | ブラウザ E2E テスト |
| **ruff** | Python の lint / format |
| **mypy** | Python の型チェック |
| **pytest** | Python のユニットテスト |
| **GitHub Actions** | PR・push で上記をすべて自動実行 |

### テスタビリティの設計ポイント

ロジックを UI・HTTP レイヤーから分離することで、React・FastAPI を起動せずに単体テストできます。

```
frontend/src/features/address/
  validation.ts      ← 純粋関数（vitest のみでテスト可）
  AddressForm.tsx    ← UI（@testing-library/react でテスト）

backend/app/domain/
  validation.py      ← 純粋関数（pytest のみでテスト可）
backend/app/api/routes/
  validate.py        ← FastAPI ルーター（薄いレイヤー）
```

## 必要なもの

- Node.js 22.x（[公式サイト](https://nodejs.org/)からインストール）
- Python 3.11 以上
- uv（`pip install uv` または [公式サイト](https://docs.astral.sh/uv/)）

## セットアップ

```powershell
# フロントエンド
cd frontend
npm install
npx playwright install chromium  # E2E テスト用ブラウザ（初回のみ）

# バックエンド
cd ..\backend
uv sync
```

## 起動方法

ターミナルを 2 つ開いて以下を実行します。

**ターミナル 1（バックエンド）:**
```powershell
cd backend
uv run uvicorn app.main:app --reload
```

**ターミナル 2（フロントエンド）:**
```powershell
cd frontend
npm run dev
```

ブラウザで http://localhost:5173 を開くと住所入力フォームが表示されます。

## テストの実行

```powershell
# Python ユニットテスト
cd backend
uv run pytest

# TypeScript ユニットテスト
cd frontend
npm run test

# Playwright E2E テスト（BE・FE を起動した状態で実行）
cd frontend
npm run e2e
```

## CI パイプライン

GitHub Actions で PR・push のたびに以下の 3 ジョブが並列実行されます。

```
backend  ── ruff check → ruff format --check → mypy → pytest
frontend ── tsc → biome check → vite build → vitest
e2e      ── BE起動 → FE起動 → playwright test
```

設定ファイル: [.github/workflows/ci.yml](.github/workflows/ci.yml)
