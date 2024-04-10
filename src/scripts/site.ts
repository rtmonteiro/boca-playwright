// ========================================================================
// Copyright Universidade Federal do Espirito Santo (Ufes)
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
//
// This program is released under license GNU GPL v3+ license.
//
// ========================================================================

import { type Page } from 'playwright';
import { BASE_URL } from '../index';
import { type SiteModel } from '../data/site';
import { DateTime } from 'luxon';
import { defineDurationInMinutes } from '../utils/time';
export async function fillSite(page: Page, site: SiteModel): Promise<void> {
  await page.goto(BASE_URL + '/admin/');
  await page.getByRole('link', { name: 'Site' }).click();

  if (site.id != null) {
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
  await page
    .locator('input[name="startdateh"]')
    .fill(startDate.hour.toString());
  await page.locator('input[name="startdatemin"]').click();
  await page
    .locator('input[name="startdatemin"]')
    .fill(startDate.minute.toString());
  await page.locator('input[name="startdated"]').click();
  await page.locator('input[name="startdated"]').fill(startDate.day.toString());
  await page.locator('input[name="startdatem"]').click();
  await page
    .locator('input[name="startdatem"]')
    .fill(startDate.month.toString());
  await page.locator('input[name="startdatey"]').click();
  await page
    .locator('input[name="startdatey"]')
    .fill(startDate.year.toString());
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

  if (site.globalScore != null) {
    await page
      .locator('input[name="globalscore"]')
      .fill(site.globalScore.toString());
  }

  if (site.autoJudge ?? false) {
    await page.locator('input[name="autojudge"]').check();
  }

  if (site.scoreLevel != null) {
    await page
      .locator('input[name="scorelevel"]')
      .fill(site.scoreLevel.toString());
  }

  if (site.globalScoreboard != null) {
    await page
      .locator('input[name="globalscoreboard"]')
      .fill(site.globalScoreboard.toString());
  }
}

export async function createSite(page: Page, site: SiteModel): Promise<void> {
  await fillSite(page, site);
  page.once('dialog', (dialog) => {
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Send' }).click();
}
