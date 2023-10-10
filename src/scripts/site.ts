import {Page} from "playwright";
import {BASE_URL} from "../index";
import {SiteModel} from "../data/site";
import {DateTime} from "luxon";
import {defineDurationInMinutes} from "../utils/time";
export async function fillSite(page: Page, site: SiteModel) {
    await page.goto(BASE_URL+'/admin/');
    await page.getByRole('link', { name: 'Site' }).click();

    if (site.id) {
        await page.locator('select[name="site"]').selectOption(site.id.toString());
    } else {
        await page.locator('select[name="site"]').selectOption('new');
    }

    await page.locator('input[name="name"]').click();
    await page.locator('input[name="name"]').fill(site.name);
    await page.locator('input[name="startdateh"]').click();
    const startDate = DateTime.fromFormat(site.startDate, 'yyyy-MM-dd HH:mm');
    const endDate = DateTime.fromFormat(site.endDate, 'yyyy-MM-dd HH:mm');


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
    const duration = defineDurationInMinutes(startDate, endDate);
    await page.locator('input[name="duration"]').fill(duration.toString());
    await page.locator('input[name="lastmileanswer"]').fill(duration.toString());
    await page.locator('input[name="lastmilescore"]').fill(duration.toString());
    await page.locator('input[name="judging"]').fill(site.runs.toString());
    await page.locator('input[name="tasking"]').fill(site.tasks.toString());
    await page.locator('input[name="chiefname"]').fill(site.chiefUsername);
    if (site.active) {
        await page.locator('input[name="active"]').check();
    } else {
        await page.locator('input[name="active"]').uncheck();
    }

    if (site.autoEnd) {
        await page.locator('input[name="autoend"]').check();
    } else {
        await page.locator('input[name="autoend"]').uncheck();
    }

    if (site.globalScore) {
        await page.locator('input[name="globalscore"]').fill(site.globalScore.toString());
    }

    if (site.autoJudge) {
        await page.locator('input[name="autojudge"]').check();
    }

    if (site.scoreLevel) {
        await page.locator('input[name="scorelevel"]').fill(site.scoreLevel.toString());
    }

    if (site.globalScoreboard) {
        await page.locator('input[name="globalscoreboard"]').fill(site.globalScoreboard.toString());
    }
}

export async function createSite(page: Page, site: SiteModel) {
    await fillSite(page, site);
    page.once('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => {});
    });
    await page.getByRole('button', { name: 'Send' }).click();
}
