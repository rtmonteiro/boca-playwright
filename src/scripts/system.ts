import {Dialog, Page} from "playwright";

const BASE_URL = "localhost:8000/boca"

interface Language {
    id: number;
    name: string;
    extension: string;
}
export interface Contest {
    setup: {
        id?: number;
        name: string;
        startDate: Date;
        endDate: Date;
        stopAnswering?: number;
        stopScorebord?: number;
        penalty?: number;
        maxFileSize?: number;
        mainSiteUrl?: string;
        mainSiteNumber: number;
        localSiteNumber: number;
        active: boolean;
    },
    languages: Language[],
}

async function defineDuration(page: Page, contest: Contest) {
    const hour = await page.locator('input[name="startdateh"]').getAttribute('value') ?? "0";
    const minute = await page.locator('input[name="startdatemin"]').getAttribute('value') ?? "0";
    const day = await page.locator('input[name="startdated"]').getAttribute('value') ?? new Date().getDay().toString();
    const month = await page.locator('input[name="startdatem"]').getAttribute('value') ?? new Date().getMonth().toString();
    const year = await page.locator('input[name="startdatey"]').getAttribute('value') ?? new Date().getFullYear().toString();

    const startDate = new Date(
        Number(year),
        Number(month),
        Number(day),
        Number(hour),
        Number(minute)
    );
    return new Date(contest.setup.endDate).getTime() - startDate.getTime();
}

async function fillContext(page: Page, contest: Contest) {
    await page.goto(BASE_URL+'/system/');
    await page.getByRole('link', { name: 'Contest' }).click();
    if (contest.setup.id) {
        await page.locator('select[name="contest"]').selectOption(contest.setup.id.toString());
    } else {
        await page.locator('select[name="contest"]').selectOption('new');
    }
    await page.locator('input[name="name"]').click();
    await page.locator('input[name="name"]').fill(contest.setup.name);
    const startDate = {
        hour: 22,
        minute: 0,
        day: 1,
        month: 1,
        year: 2021,
    }
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
    const duration = await defineDuration(page, contest);
    await page.locator('input[name="duration"]').fill(duration.toString());

    await page.locator('input[name="lastmileanswer"]').click();
    if (contest.setup.stopAnswering) {
        await page.locator('input[name="lastmileanswer"]').fill(contest.setup.stopAnswering.toString());
    } else {
        await page.locator('input[name="lastmileanswer"]').fill(duration.toString());
    }

    await page.locator('input[name="lastmilescore"]').click();
    if (contest.setup.stopScorebord) {
        await page.locator('input[name="lastmilescore"]').fill(contest.setup.stopScorebord.toString());
    } else {
        await page.locator('input[name="lastmilescore"]').fill(duration.toString());
    }

    await page.locator('input[name="penalty"]').click();
    if (contest.setup.penalty) {
        await page.locator('input[name="penalty"]').fill(contest.setup.penalty.toString());
    } else {
        await page.locator('input[name="penalty"]').fill(duration.toString());
    }

    await page.locator('input[name="maxfilesize"]').click();
    if (contest.setup.maxFileSize) {
        await page.locator('input[name="maxfilesize"]').fill(contest.setup.maxFileSize.toString());
    } else {
        await page.locator('input[name="maxfilesize"]').fill(duration.toString());
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

export async function createContest(page: Page, contest: Contest) {
    await fillContext(page, contest);
    page.once('dialog', (dialog: Dialog) => {
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