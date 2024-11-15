import { expect, test } from "@playwright/test";

import {
    bitcoinSendToAddress,
    generateBitcoinBlock,
    generateInvoiceLnd,
} from "./utils";

test.describe("Submarine swap", () => {
    test.beforeEach(async () => {
        await generateBitcoinBlock();
    });

    test("Submarine swap BTC/BTC", async ({ page }) => {
        await page.goto("/");

        const divFlipAssets = page.locator("#flip-assets");
        await divFlipAssets.click();

        const receiveAmount = "0.01";
        const inputReceiveAmount = page.locator(
            "input[data-testid='receiveAmount']",
        );
        await inputReceiveAmount.fill(receiveAmount);

        const inputSendAmount = page.locator("input[data-testid='sendAmount']");
        const sendAmount = "0.01005302";
        await expect(inputSendAmount).toHaveValue(sendAmount);

        const invoiceInput = page.locator("textarea[data-testid='invoice']");
        await invoiceInput.fill(await generateInvoiceLnd(1000000));
        const buttonCreateSwap = page.locator(
            "button[data-testid='create-swap-button']",
        );
        await buttonCreateSwap.click();

        const skipDownload = page.getByText("Skip download");
        await skipDownload.click();

        const copyAddressButton = page.getByText("address");
        expect(copyAddressButton).toBeDefined();
        await copyAddressButton.click();

        const sendAddress = await page.evaluate(() => {
            return navigator.clipboard.readText();
        });
        expect(sendAddress).toBeDefined();
        await bitcoinSendToAddress(sendAddress, sendAmount);

        await generateBitcoinBlock();
        // TODO: verify amounts
    });

    test("Create with LNURL", async ({ page }) => {
        await page.goto("/");

        await page
            .locator(
                "div:nth-child(3) > .asset-wrap > .asset > .asset-selection",
            )
            .click();
        await page.getByTestId("select-LN").click();
        await page.locator(".asset-wrap").first().click();
        await page.getByTestId("select-L-BTC").click();

        await page.getByTestId("invoice").click();
        await page
            .getByTestId("invoice")
            .fill(
                "LNURL1DP68GUP69UHNZV3H9CCZUVPWXYARXVPSXQHKZURF9AKXUATJD3CQQKE2EU",
            );

        await page.getByTestId("sendAmount").fill("50 0000");

        await page.getByTestId("create-swap-button").click();
        // When we can click that button, the swap was created
        await page.getByRole("button", { name: "Skip download" }).click();
    });
});
