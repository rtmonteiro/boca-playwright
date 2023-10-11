import {BASE_URL} from "../index";
import {Language} from "../data/language";
import {Dialog, Page} from "playwright";

export async function createLanguage(page: Page, language: Language) {
    await page.goto(BASE_URL + '/admin/language.php');
    await page.locator("input[name='langnumber']").fill(language.id.toString());
    await page.locator("input[name='langname']").fill(language.name);
    await page.locator("input[name='langextension']").fill(language.extension);
    await page.locator("input[name='Submit3']").click();
}

export async function deleteLanguage(page: Page, language: Language) {
    await page.goto(BASE_URL + '/admin/language.php');

    page.on('dialog', (dialog: Dialog) => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.accept().catch(() => {
            console.error('Dialog was already closed when dismissed');
        })
    });

    await page.locator("table:nth-of-type(3) > tbody > tr",
        { has: await page.locator("td:nth-of-type(2)",
                {hasText: language.name}) })
        .locator("td:nth-of-type(1) a").click();
}