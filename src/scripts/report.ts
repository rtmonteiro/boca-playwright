import {Locator, Page} from "playwright";
import * as fs from "fs";
import {BASE_URL} from "../index.ts";

const statusArr = [ 'NA', 'YES', 'NO_Compilation', 'NO_Runtime', 'NO_Timelimit', 'NO_Presentation', 'NO_Wrong', 'NO_Contact', 'NO_Name' ];

async function downloadFile(page: Page, path: string, file: Locator, filename?: string) {
    // Start waiting for download before clicking. Note no await.
    const downloadPromise = page.waitForEvent('download');
    await file.click();
    const download = await downloadPromise;

    // Wait for the download process to complete and save the downloaded file somewhere.
    if (!filename) filename = download.suggestedFilename();
    await download.saveAs(`${path}/${filename}`);
}

async function saveFiles(page: Page, link: Locator, outDir: string, username: string, problem: string) {
    await link.click();

    const statusInt : number = Number(await page.locator("select").inputValue());
    const status : string = statusArr[statusInt];
    const label = statusInt == 1 ? 'YES' : 'NO';
    const run = (await page.locator("html > body > form > center:nth-of-type(1) > table > tbody > tr:nth-of-type(2) > td:nth-of-type(2)").textContent()).trim();

    const path = `${outDir}/${username}/${problem}/${run}_${label}`;

    // Verify if the folder exist and create it if not
    if (!fs.existsSync(path)) fs.mkdirSync(path, {recursive: true})

    const code = await page.locator("table > tbody > tr:nth-of-type(6) > td:nth-of-type(2) > a:nth-of-type(1)");
    await downloadFile(page, path, code);

    if (statusInt != 0) {
        const stdout = page.locator("html > body > form > center:nth-of-type(3) > table > tbody > tr:nth-of-type(3) > td:nth-of-type(2)");
        await downloadFile(page, path, stdout, "stdout.txt");

        const stderr = page.locator("html > body > form > center:nth-of-type(3) > table > tbody > tr:nth-of-type(4) > td:nth-of-type(2)");
        await downloadFile(page, path, stderr, "stderr.txt");
    }
    
    await page.goBack();
}

export async function retrieveFiles(page: Page, outDir: string) {
    await page.goto(BASE_URL+'/admin');

    await page.getByRole('link', { name: 'Run' }).click();

    // Get link, username and problem name
    const rows = await page.locator("html > body > form > table > tbody > tr:nth-of-type(n+2)", {hasText: /\d+/}).all();

    for (const row of rows) {
        const link = await row.locator("td:nth-of-type(1) > a");
        const username = await row.locator("td:nth-of-type(3)").textContent();
        const problem = await row.locator("td:nth-of-type(5)").textContent();

        await saveFiles(page, link, outDir, username, problem);

    }
}