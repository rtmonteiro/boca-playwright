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

import { type Dialog, type Page } from 'playwright';
import { DateTime } from 'luxon';
import { BASE_URL } from '../index';
import { defineDuration, fillDateField } from '../utils/time';
import { type CreateContest, type Contest } from '../data/contest';

async function fillContest(page: Page, contest: Contest): Promise<void> {
  if (contest.name !== undefined) {
    await page.locator('input[name="name"]').fill(contest.name);
  }

  if (contest.startDate !== undefined) {
    const startDate = DateTime.fromFormat(
      contest.startDate,
      'yyyy-MM-dd HH:mm'
    );
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

    if (contest.endDate !== undefined) {
      const endDate = DateTime.fromFormat(contest.endDate, 'yyyy-MM-dd HH:mm');
      const duration = defineDuration(startDate, endDate);
      await page
        .locator('input[name="duration"]')
        .fill(duration.minutes.toString());

      await fillDateField(
        startDate,
        page,
        duration,
        15,
        'input[name="lastmileanswer"]',
        contest.stopAnsweringDate
      );

      await fillDateField(
        startDate,
        page,
        duration,
        60,
        'input[name="lastmilescore"]',
        contest.stopScoreboardDate
      );

      await fillDateField(
        startDate,
        page,
        duration,
        90,
        'input[name="penalty"]',
        contest.penaltyDate
      );
    }
  }

  if (contest.maxFileSize !== undefined) {
    await page
      .locator('input[name="maxfilesize"]')
      .fill(contest.maxFileSize.toString());
  }

  if (contest.mainSiteUrl !== undefined) {
    await page.locator('input[name="mainsiteurl"]').fill(contest.mainSiteUrl);
  }

  if (contest.mainSiteNumber !== undefined) {
    await page
      .locator('input[name="mainsite"]')
      .fill(contest.mainSiteNumber.toString());
  }

  if (contest.localSiteNumber !== undefined) {
    await page
      .locator('input[name="localsite"]')
      .fill(contest.localSiteNumber.toString());
  }
}

export async function createContest(
  page: Page,
  contest: CreateContest | undefined
): Promise<string | null> {
  await page.goto(BASE_URL + '/system/');
  await page.getByRole('link', { name: 'Contest' }).click();
  await selectContest(page, contest);

  if (contest !== undefined) {
    await fillContest(page, contest);
  }
  page.once('dialog', (dialog: Dialog) => {
    dialog.accept().catch(() => {
      console.error('Dialog was already closed when accepted');
    });
  });
  if (contest?.active) {
    await page.getByRole('button', { name: 'Activate' }).click();
  } else {
    await page.getByRole('button', { name: 'Send' }).click();
  }
  return await page.$eval(
    'form > center:nth-child(5) > table > tbody > tr:nth-child(1) > td:nth-child(2) > select',
    (element) => element.value
  );
}

export async function updateContest(
  page: Page,
  contest: Contest
): Promise<void> {
  await fillContest(page, contest);
  page.once('dialog', (dialog: Dialog) => {
    dialog.accept().catch(() => {
      console.error('Dialog was already closed when accepted');
    });
  });
  await page.getByRole('button', { name: 'Send' }).click();
}

async function selectContest(
  page: Page,
  contest: Contest | undefined
): Promise<void> {
  if (contest?.id !== undefined) {
    await page
      .locator('select[name="contest"]')
      .selectOption(contest.id.toString());
  } else {
    await page.locator('select[name="contest"]').selectOption('new');
  }
}