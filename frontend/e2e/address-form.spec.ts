import { expect, test } from "@playwright/test";

const fillForm = async (page: Parameters<typeof test>[1] extends (args: { page: infer P }) => unknown ? P : never) => {
  await page.getByLabel("郵便番号").fill("150-0001");
  await page.getByLabel("都道府県").fill("東京都");
  await page.getByLabel("市区町村").fill("渋谷区");
  await page.getByLabel("番地").fill("1-2-3");
};

test("住所を入力して送信すると完了画面が表示される", async ({ page }) => {
  await page.goto("/");
  await fillForm(page);
  await page.getByRole("button", { name: "送信する" }).click();

  await expect(page.getByRole("heading", { name: "送信完了" })).toBeVisible();
  await expect(page.getByText("150-0001")).toBeVisible();
  await expect(page.getByText("東京都")).toBeVisible();
});

test("必須項目が空のままだとエラーが表示される", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "送信する" }).click();

  await expect(page.getByRole("alert").first()).toBeVisible();
});

test("完了画面から入力に戻れる", async ({ page }) => {
  await page.goto("/");
  await fillForm(page);
  await page.getByRole("button", { name: "送信する" }).click();

  await expect(page.getByRole("heading", { name: "送信完了" })).toBeVisible();
  await page.getByRole("button", { name: "入力に戻る" }).click();
  await expect(page.getByRole("heading", { name: "住所入力フォーム" })).toBeVisible();
});
