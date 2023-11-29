import {Dialog, Page} from "playwright";
import {DateTime} from "luxon";
import {BASE_URL} from "../index";
import {defineDurationInMinutes} from "../utils/time";
import {ContestModel} from "../data/contest";

async function fillContest(page: Page, contest: ContestModel) {
    await page.goto(BASE_URL+'/system/');
    await page.getByRole('link', { name: 'Contest' }).click();
    if (contest.setup.id) {
        await page.locator('select[name="contest"]').selectOption(contest.setup.id.toString());
    } else {
        await page.locator('select[name="contest"]').selectOption('new');
    }
    await page.locator('input[name="name"]').click();
    await page.locator('input[name="name"]').fill(contest.setup.name);

    const startDate = DateTime.fromFormat(contest.setup.startDate, 'yyyy-MM-dd HH:mm');
    await page.locator('input[name="startdateh"]').click();
    await page.locator('input[name="startdateh"]').fill(startDate.hour.toString());
    await page.locator('input[name="startdatemin"]').click();
    await page.locator('input[name="startdatemin"]').fill(startDate.minute.toString());
    await page.locator('input[name="startdated"]').click();
    await page.locator('input[name="startdated"]').fill(startDate.day.toString());
    await page.locator('input[name="startdatem"]').click();
    await page.locator('input[name="startdatem"]').fill(startDate.month.toString());
    await page.locator('input[name="startdatey"]').click();
    await page.locator('input[name="startdatey"]').fill(startDate.year.toString());
    await page.locator('input[name="duration"]').click();
    const endDate = DateTime.fromFormat(contest.setup.endDate, 'yyyy-MM-dd HH:mm');
    const duration = defineDurationInMinutes(startDate, endDate);
    await page.locator('input[name="duration"]').fill(duration.toString());

    await page.locator('input[name="lastmileanswer"]').click();
    if (contest.setup.stopAnswering) {
        await page.locator('input[name="lastmileanswer"]').fill(contest.setup.stopAnswering.toString());
    } else {
        await page.locator('input[name="lastmileanswer"]').fill(duration.toString());
    }

    await page.locator('input[name="lastmilescore"]').click();
    if (contest.setup.stopScoreboard) {
        await page.locator('input[name="lastmilescore"]').fill(contest.setup.stopScoreboard.toString());
    } else {
        await page.locator('input[name="lastmilescore"]').fill(duration.toString());
    }

    await page.locator('input[name="penalty"]').click();
    if (contest.setup.penalty) {
        await page.locator('input[name="penalty"]').fill(contest.setup.penalty.toString());
    } else {
        await page.locator('input[name="penalty"]').fill(duration.toString());
    }

    if (contest.setup.maxFileSize) {
        await page.locator('input[name="maxfilesize"]').click();
        await page.locator('input[name="maxfilesize"]').fill(contest.setup.maxFileSize.toString());
    }

    if (contest.setup.mainSiteUrl) {
        await page.locator('input[name="mainsiteurl"]').click();
        await page.locator('input[name="mainsiteurl"]').fill(contest.setup.mainSiteUrl);
    }

    await page.locator('input[name="mainsite"]').click();
    await page.locator('input[name="mainsite"]').fill(contest.setup.mainSiteNumber.toString());

    await page.locator('input[name="localsite"]').click();
    await page.locator('input[name="localsite"]').fill(contest.setup.localSiteNumber.toString());
}

export async function createContest(page: Page, contest: ContestModel) {
    await fillContest(page, contest);
    page.once('dialog', (dialog: Dialog) => {
        console.log(dialog.message());
        dialog.accept().catch(() => {
            console.error('Dialog was already closed when accepted');
        });
    });
    if (contest.setup.active) {
        await page.getByRole('button', { name: 'Activate' }).click();
    } else {
        await page.getByRole('button', { name: 'Send' }).click();
    }
}

export async function clearContest(page: Page, contest: ContestModel) {
    if (!contest.setup.id) {
        throw new Error('Contest ID is not defined');
    }
    await page.goto(BASE_URL+'/system/');
    await page.getByRole('link', { name: 'Contest' }).click();
    await page.locator('select[name="contest"]').selectOption(contest.setup.id.toString());
    await page.getByRole('button', { name: 'Clear' }).click();

    page.once('dialog', (dialog: Dialog) => {
        console.log(dialog.message());
        dialog.accept().catch(() => {
            console.error('Dialog was already closed when accepted');
        });
    });
}
