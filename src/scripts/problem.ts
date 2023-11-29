import {Dialog, Page} from "playwright";
import {BASE_URL} from "../index";
import {Problem} from "../data/problem";

async function fillProblems(page: Page, problem: Problem) {
    await page.goto(BASE_URL+'/admin/');
    await page.getByRole('link', { name: 'Problems' }).click();
    await page.locator('input[name="problemnumber"]').fill(problem.id.toString());
    await page.locator('input[name="problemname"]').fill(problem.name);
    await page.locator('input[name="probleminput"]').setInputFiles(problem.filePath);
    if (problem.colorName) {
        await page.locator('input[name="colorname"]').fill(problem.colorName);
    }
    if (problem.colorCode) {
        await page.locator('input[name="color"]').fill(problem.colorCode);
    }

    await page.locator('center').filter({ hasText: 'Send' }).click();
}

export async function createProblem(page: Page, problem: Problem) {
    await fillProblems(page, problem);
    page.once('dialog', (dialog: Dialog) => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.accept().catch(() => {
            console.error('Dialog was already closed when dismissed');
        })
    });
    await page.getByRole('button', { name: 'Send' }).click();

}
