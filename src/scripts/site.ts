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

import { DateTime } from 'luxon';
import { type Page } from 'playwright';
import { type Site } from '../data/site';
import { SiteError, SiteMessages } from '../errors/read_errors';
import { BASE_URL } from '../index';
import { dialogHandler } from '../utils/handlers';
import { defineDuration, fillDateField } from '../utils/time';

export async function createSite(page: Page, site: Site): Promise<Site> {
  await page.goto(BASE_URL + '/admin/site.php');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  await checkSiteNotExists(page, site.id);
  await selectSite(page, undefined);
  await page.locator('input[name="Number"]').fill(site.id);
  await page.getByRole('button', { name: 'Go', exact: true }).click();
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');
  await fillSiteForm(page, site);
  page.once('dialog', dialogHandler);
  await page.getByRole('button', { name: 'Send' }).click();
  return await getSiteFromForm(page);
}

export async function getSite(page: Page, id: Site['id']): Promise<Site> {
  await page.goto(BASE_URL + '/admin/site.php');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  await selectSite(page, id);
  return await getSiteFromForm(page);
}

export async function getSites(page: Page): Promise<Site[]> {
  await page.goto(BASE_URL + '/admin/site.php');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  const optionEls = await page.locator('select[name="site"] option').all();
  const options = await Promise.all(
    optionEls.map(async (el) => el.textContent())
  ).then((options) =>
    // Remove the last option (new)
    options.filter((option) => option !== 'new')
  );
  if (options.some((option) => option === undefined) || options.length === 1) {
    throw new SiteError(SiteMessages.NOT_FOUND);
  }
  const sites: Site[] = [];
  for (const option of options) {
    await page.goto(BASE_URL + '/admin/site.php');
    // Wait for load state
    await page.waitForLoadState('domcontentloaded');
    await selectSite(page, option!);
    const site: Site = await getSiteFromForm(page);
    if (site !== undefined) {
      sites.push(site);
    }
  }
  return sites;
}

export async function logoffUsersSite(
  page: Page,
  id: Site['id']
): Promise<void> {
  await page.goto(BASE_URL + '/admin/site.php');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  await selectSite(page, id);
  page.once('dialog', dialogHandler);
  await page.getByRole('button', { name: 'Logoff' }).click();
}

export async function updateSite(page: Page, site: Site): Promise<Site> {
  await page.goto(BASE_URL + '/admin/site.php');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  await selectSite(page, site.id);
  await fillSiteForm(page, site);
  page.once('dialog', dialogHandler);
  await page.getByRole('button', { name: 'Send' }).click();
  return await getSiteFromForm(page);
}

async function checkSiteExists(page: Page, id: string) {
  const optionEls = await page.locator('select[name="site"] option').all();
  const options = await Promise.all(
    optionEls.map(async (el) => el.textContent())
  );

  const hasIdInOption = options.some((option) => option?.match(`^${id}\\*?$`));
  if (!hasIdInOption) {
    throw new SiteError(SiteMessages.NOT_FOUND);
  }
}

async function checkSiteNotExists(page: Page, id: string) {
  const optionEls = await page.locator('select[name="site"] option').all();
  const options = await Promise.all(
    optionEls.map(async (el) => el.textContent())
  );

  const hasIdInOption = options.some((option) => option?.match(`^${id}\\*?$`));
  if (hasIdInOption) {
    throw new SiteError(SiteMessages.ID_ALREADY_IN_USE);
  }
}

export async function fillSiteForm(page: Page, site: Site): Promise<void> {
  if (site.name !== undefined) {
    await page.locator('input[name="name"]').fill(site.name);
  }

  let startDate;
  if (site.startDate !== undefined) {
    startDate = DateTime.fromFormat(site.startDate, 'yyyy-MM-dd HH:mm');

    if (startDate.toUnixInteger() >= 0) {
      await page
        .locator('input[name="startdateh"]')
        .fill(startDate.hour.toString());
      await page
        .locator('input[name="startdatemin"]')
        .fill(startDate.minute.toString());
      await page
        .locator('input[name="startdated"]')
        .fill(startDate.day.toString());
      await page
        .locator('input[name="startdatem"]')
        .fill(startDate.month.toString());
      await page
        .locator('input[name="startdatey"]')
        .fill(startDate.year.toString());
    } else {
      startDate = undefined;
    }
  }

  if (startDate === undefined) {
    const hour = await page.locator('input[name="startdateh"]').inputValue();
    const minute = await page
      .locator('input[name="startdatemin"]')
      .inputValue();
    const day = await page.locator('input[name="startdated"]').inputValue();
    const month = await page.locator('input[name="startdatem"]').inputValue();
    const year = await page.locator('input[name="startdatey"]').inputValue();
    startDate = DateTime.fromFormat(
      `${year}-${month}-${day} ${hour}:${minute}`,
      'yyyy-MM-dd HH:mm'
    );
  }

  let duration;
  if (site.endDate !== undefined) {
    const endDate = DateTime.fromFormat(site.endDate, 'yyyy-MM-dd HH:mm');
    duration = defineDuration(startDate, endDate);
    if (!duration.isValid) throw new SiteError(SiteMessages.NEGATIVE_DURATION);
    await page
      .locator('input[name="duration"]')
      .fill(duration.minutes.toString());
  } else {
    const dur = await page.locator('input[name="duration"]').inputValue();
    const endDate = startDate.plus({ minutes: parseInt(dur) });
    duration = defineDuration(startDate, endDate);
  }

  if (site.stopAnsweringDate !== undefined) {
    await fillDateField(
      startDate,
      page,
      duration,
      15,
      'input[name="lastmileanswer"]',
      site.stopAnsweringDate
    );
  }

  if (site.stopScoreboardDate !== undefined) {
    await fillDateField(
      startDate,
      page,
      duration,
      60,
      'input[name="lastmilescore"]',
      site.stopScoreboardDate
    );
  }

  if (site.runsClarsSiteIds != undefined) {
    await page.locator('input[name="judging"]').fill(site.runsClarsSiteIds);
  }

  if (site.tasksSiteIds !== undefined) {
    await page.locator('input[name="tasking"]').fill(site.tasksSiteIds);
  }

  if (site.globalScoreSiteIds !== undefined) {
    await page
      .locator('input[name="globalscore"]')
      .fill(site.globalScoreSiteIds);
  }

  if (site.chiefUsername !== undefined) {
    await page.locator('input[name="chiefname"]').fill(site.chiefUsername);
  }

  if (site.isActive !== undefined) {
    if (site.isActive === 'Yes') {
      await page.locator('input[name="active"]').check();
    } else {
      await page.locator('input[name="active"]').uncheck();
    }
  }

  if (site.enableAutoEnd !== undefined) {
    if (site.enableAutoEnd === 'Yes') {
      await page.locator('input[name="autoend"]').check();
    } else {
      await page.locator('input[name="autoend"]').uncheck();
    }
  }

  if (site.enableAutoJudge !== undefined) {
    if (site.enableAutoJudge === 'Yes') {
      await page.locator('input[name="autojudge"]').check();
    } else {
      await page.locator('input[name="autojudge"]').uncheck();
    }
  }

  if (site.scoreLevel !== undefined) {
    await page
      .locator('input[name="scorelevel"]')
      .fill(site.scoreLevel.toString());
  }
}

async function getSiteFromForm(page: Page): Promise<Site> {
  const site: Site = {} as Site;
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  if (await page.locator('select[name="site"]').isVisible()) {
    site.id = (await page
      .locator('option[selected]')
      .getAttribute('value')) as string;
  }
  // if (await page.locator('select[name="site"]').isVisible()) {
  //   site.id = await page.locator('select[name="site"]').inputValue();
  // }
  if (await page.locator('input[name="name"]').isVisible()) {
    site.name = await page.locator('input[name="name"]').inputValue();
  }
  if (await page.locator('input[name="startdateh"]').isVisible()) {
    const hour = await page.locator('input[name="startdateh"]').inputValue();
    const minute = await page
      .locator('input[name="startdatemin"]')
      .inputValue();
    const day = await page.locator('input[name="startdated"]').inputValue();
    const month = await page.locator('input[name="startdatem"]').inputValue();
    const year = await page.locator('input[name="startdatey"]').inputValue();
    site.startDate = `${year}-${month}-${day} ${hour}:${minute}`;
  }
  if (
    site.startDate &&
    (await page.locator('input[name="duration"]').isVisible())
  ) {
    const endDate = await page.locator('input[name="duration"]').inputValue();
    site.endDate = DateTime.fromFormat(site.startDate, 'yyyy-MM-dd HH:mm')
      .plus({ minutes: parseInt(endDate) })
      .toFormat('yyyy-MM-dd HH:mm');
  }
  if (
    site.startDate &&
    (await page.locator('input[name="lastmileanswer"]').isVisible())
  ) {
    const stopAnswering = await page
      .locator('input[name="lastmileanswer"]')
      .inputValue();
    site.stopAnsweringDate = DateTime.fromFormat(
      site.startDate,
      'yyyy-MM-dd HH:mm'
    )
      .plus({ minutes: parseInt(stopAnswering) })
      .toFormat('yyyy-MM-dd HH:mm');
  }
  if (
    site.startDate &&
    (await page.locator('input[name="lastmilescore"]').isVisible())
  ) {
    const stopScoreboard = await page
      .locator('input[name="lastmilescore"]')
      .inputValue();
    site.stopScoreboardDate = DateTime.fromFormat(
      site.startDate,
      'yyyy-MM-dd HH:mm'
    )
      .plus({ minutes: parseInt(stopScoreboard) })
      .toFormat('yyyy-MM-dd HH:mm');
  }
  if (await page.locator('input[name="judging"]').isVisible()) {
    site.runsClarsSiteIds = await page
      .locator('input[name="judging"]')
      .inputValue();
  }
  if (await page.locator('input[name="tasking"]').isVisible()) {
    site.tasksSiteIds = await page
      .locator('input[name="tasking"]')
      .inputValue();
  }
  if (await page.locator('input[name="globalscore"]').isVisible()) {
    site.globalScoreSiteIds = await page
      .locator('input[name="globalscore"]')
      .inputValue();
  }
  if (await page.locator('input[name="chiefname"]').isVisible()) {
    site.chiefUsername = await page
      .locator('input[name="chiefname"]')
      .inputValue();
  }
  if (await page.locator('input[name="active"]').isVisible()) {
    site.isActive = (await page.locator('input[name="active"]').isChecked())
      ? 'Yes'
      : 'No';
  }
  if (await page.locator('input[name="autoend"]').isVisible()) {
    site.enableAutoEnd = (await page
      .locator('input[name="autoend"]')
      .isChecked())
      ? 'Yes'
      : 'No';
  }
  if (await page.locator('input[name="autojudge"]').isVisible()) {
    site.enableAutoJudge = (await page
      .locator('input[name="autojudge"]')
      .isChecked())
      ? 'Yes'
      : 'No';
  }
  if (await page.locator('input[name="scorelevel"]').isVisible()) {
    site.scoreLevel = (await page
      .locator('input[name="scorelevel"]')
      .inputValue()) as Site['scoreLevel'];
  }
  return site;
}

async function selectSite(
  page: Page,
  id: Site['id'] | undefined
): Promise<void> {
  if (id !== undefined) {
    await checkSiteExists(page, id);
    await page.locator('select[name="site"]').selectOption(id);
  } else {
    await page.locator('select[name="site"]').selectOption('new');
  }

  // Wait for load state
  await page.waitForLoadState('domcontentloaded');
}
