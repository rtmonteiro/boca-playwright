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
import { DateTime } from 'luxon';
import { BASE_URL } from '../index';
import { defineDuration, fillDateField } from '../utils/time';
import {
  type TCreateContest,
  type TUpdateContest,
  type TContestForm,
  ContestForm,
  Contest
} from '../data/contest';
import { dialogHandler } from '../utils/handlers';

export async function createContest(
  page: Page,
  contest: TCreateContest | undefined
): Promise<TContestForm> {
  await page.goto(BASE_URL + '/system/');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');
  await page.getByRole('link', { name: 'Contest' }).click();
  await selectContest(page, undefined);

  if (contest !== undefined) {
    await fillContest(page, contest);
  }
  page.once('dialog', dialogHandler);
  await page.getByRole('button', { name: 'Send' }).click();
  return await getContestForm(page);
}

export async function updateContest(
  page: Page,
  contest: TUpdateContest
): Promise<TContestForm> {
  await page.goto(BASE_URL + '/system/');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');
  await page.getByRole('link', { name: 'Contest' }).click();
  await selectContest(page, contest.id);

  await fillContest(page, contest);

  page.once('dialog', dialogHandler);
  await page.getByRole('button', { name: 'Send' }).click();
  return await getContestForm(page);
}

export async function getContest(
  page: Page,
  contestId: Contest['id']
): Promise<TContestForm> {
  await page.goto(BASE_URL + '/system/contest.php');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');
  await selectContest(page, contestId);
  return await getContestForm(page);
}

async function fillContest(page: Page, contest: TUpdateContest): Promise<void> {
  if (contest.name !== undefined) {
    await page.locator('input[name="name"]').fill(contest.name);
  }

  let startDate;
  if (contest.startDate !== undefined) {
    startDate = DateTime.fromFormat(contest.startDate, 'yyyy-MM-dd HH:mm');
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
  if (contest.endDate !== undefined) {
    const endDate = DateTime.fromFormat(contest.endDate, 'yyyy-MM-dd HH:mm');
    duration = defineDuration(startDate, endDate);
    await page
      .locator('input[name="duration"]')
      .fill(duration.minutes.toString());
  } else {
    const dur = await page.locator('input[name="duration"]').inputValue();
    const endDate = startDate.plus({ minutes: parseInt(dur) });
    duration = defineDuration(startDate, endDate);
  }

  if (contest.stopAnsweringDate !== undefined) {
    await fillDateField(
      startDate,
      page,
      duration,
      15,
      'input[name="lastmileanswer"]',
      contest.stopAnsweringDate
    );
  }

  if (contest.stopScoreboardDate !== undefined) {
    await fillDateField(
      startDate,
      page,
      duration,
      60,
      'input[name="lastmilescore"]',
      contest.stopScoreboardDate
    );
  }

  if (contest.penalty !== undefined) {
    await page.locator('input[name="penalty"]').fill(contest.penalty);
  }

  if (contest.maxFileSize !== undefined) {
    await page.locator('input[name="maxfilesize"]').fill(contest.maxFileSize);
  }

  if (contest.mainSiteUrl !== undefined) {
    await page.locator('input[name="mainsiteurl"]').fill(contest.mainSiteUrl);
  }

  if (contest.mainSiteNumber !== undefined) {
    await page.locator('input[name="mainsite"]').fill(contest.mainSiteNumber);
  }

  if (contest.localSiteNumber !== undefined) {
    await page.locator('input[name="localsite"]').fill(contest.localSiteNumber);
  }
}

async function selectContest(
  page: Page,
  id: TUpdateContest['id'] | undefined
): Promise<void> {
  if (id !== undefined) {
    await checkContestExist(page, id);
    await page.locator('select[name="contest"]').selectOption(id);
  } else {
    await page.locator('select[name="contest"]').selectOption('new');
  }
}

async function checkContestExist(page: Page, id: string) {
  const optionEls = await page.locator('select[name="contest"] option').all();
  const options = await Promise.all(
    optionEls.map(async (el) => el.textContent())
  );

  const hasIdInOption = options.some((option) => option?.match(`^${id}\\*?$`));

  if (!hasIdInOption) {
    throw new Error('Contest not found');
  }
}

async function getContestForm(page: Page): Promise<TContestForm> {
  const contest: TContestForm = new ContestForm();
  // const contest: TContestForm = new ContestForm();
  await page.locator('select[name="contest"]');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');
  // Get url from page
  const url = await page.url();
  const contestNumber = new URL(url).searchParams.get('contest');
  if (contestNumber) {
    contest.id = contestNumber ? contestNumber : '';
  }
  // if (await page.locator('select[name="contest"]').isVisible()) {
  //   contest.id = await page.locator('select[name="contest"]').inputValue();
  // }
  if (await page.locator('input[name="name"]').isVisible()) {
    contest.name = await page.locator('input[name="name"]').inputValue();
  }
  if (await page.locator('input[name="startdateh"]').isVisible()) {
    const hour = await page.locator('input[name="startdateh"]').inputValue();
    const minute = await page
      .locator('input[name="startdatemin"]')
      .inputValue();
    const day = await page.locator('input[name="startdated"]').inputValue();
    const month = await page.locator('input[name="startdatem"]').inputValue();
    const year = await page.locator('input[name="startdatey"]').inputValue();
    contest.startDate = `${year}-${month}-${day} ${hour}:${minute}`;
  }
  if (await page.locator('input[name="duration"]').isVisible()) {
    const endDate = await page.locator('input[name="duration"]').inputValue();
    contest.endDate = DateTime.fromFormat(contest.startDate, 'yyyy-MM-dd HH:mm')
      .plus({ minutes: parseInt(endDate) })
      .toFormat('yyyy-MM-dd HH:mm');
  }
  if (await page.locator('input[name="lastmileanswer"]').isVisible()) {
    const stopAnswering = await page
      .locator('input[name="lastmileanswer"]')
      .inputValue();
    contest.stopAnsweringDate = DateTime.fromFormat(
      contest.startDate,
      'yyyy-MM-dd HH:mm'
    )
      .plus({ minutes: parseInt(stopAnswering) })
      .toFormat('yyyy-MM-dd HH:mm');
  }
  if (await page.locator('input[name="lastmilescore"]').isVisible()) {
    const stopScoreboard = await page
      .locator('input[name="lastmilescore"]')
      .inputValue();
    contest.stopScoreboardDate = DateTime.fromFormat(
      contest.startDate,
      'yyyy-MM-dd HH:mm'
    )
      .plus({ minutes: parseInt(stopScoreboard) })
      .toFormat('yyyy-MM-dd HH:mm');
  }
  if (await page.locator('input[name="penalty"]').isVisible()) {
    contest.penalty = await page.locator('input[name="penalty"]').inputValue();
  }
  if (await page.locator('input[name="maxfilesize"]').isVisible()) {
    contest.maxFileSize = await page
      .locator('input[name="maxfilesize"]')
      .inputValue();
  }
  if (await page.locator('input[name="mainsiteurl"]').isVisible()) {
    contest.mainSiteUrl = await page
      .locator('input[name="mainsiteurl"]')
      .inputValue();
  }
  if (await page.locator('input[name="mainsite"]').isVisible()) {
    contest.mainSiteNumber = await page
      .locator('input[name="mainsite"]')
      .inputValue();
  }
  if (await page.locator('input[name="localsite"]').isVisible()) {
    contest.localSiteNumber = await page
      .locator('input[name="localsite"]')
      .inputValue();
  }
  return contest;
}
