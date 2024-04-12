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
import { defineDurationInMinutes } from '../utils/time';
import { type ContestModel } from '../data/contest';

async function fillContest(page: Page, contest: ContestModel): Promise<void> {
  await page.goto(BASE_URL + '/system/');
  await page.getByRole('link', { name: 'Contest' }).click();
  if (contest.config.id != null) {
    await page
      .locator('select[name="contest"]')
      .selectOption(contest.config.id.toString());
  } else {
    await page.locator('select[name="contest"]').selectOption('new');
  }
  await page.locator('input[name="name"]').fill(contest.config.name);

  const startDate = DateTime.fromFormat(
    contest.config.startDate,
    'yyyy-MM-dd HH:mm'
  );
  await page
    .locator('input[name="startdateh"]')
    .fill(startDate.hour.toString());
  await page
    .locator('input[name="startdatemin"]')
    .fill(startDate.minute.toString());
  await page.locator('input[name="startdated"]').fill(startDate.day.toString());
  await page
    .locator('input[name="startdatem"]')
    .fill(startDate.month.toString());
  await page
    .locator('input[name="startdatey"]')
    .fill(startDate.year.toString());
  const endDate = DateTime.fromFormat(
    contest.config.endDate,
    'yyyy-MM-dd HH:mm'
  );
  const duration = defineDurationInMinutes(startDate, endDate);
  await page.locator('input[name="duration"]').fill(duration.toString());

  if (contest.config.stopAnswering != null) {
    await page
      .locator('input[name="lastmileanswer"]')
      .fill(contest.config.stopAnswering.toString());
  } else {
    await page
      .locator('input[name="lastmileanswer"]')
      .fill(duration.toString());
  }

  if (contest.config.stopScoreboard != null) {
    await page
      .locator('input[name="lastmilescore"]')
      .fill(contest.config.stopScoreboard.toString());
  } else {
    await page.locator('input[name="lastmilescore"]').fill(duration.toString());
  }

  if (contest.config.penalty != null) {
    await page
      .locator('input[name="penalty"]')
      .fill(contest.config.penalty.toString());
  } else {
    await page.locator('input[name="penalty"]').fill(duration.toString());
  }

  if (contest.config.maxFileSize != null) {
    await page
      .locator('input[name="maxfilesize"]')
      .fill(contest.config.maxFileSize.toString());
  }

  if (contest.config.mainSiteUrl != null) {
    await page
      .locator('input[name="mainsiteurl"]')
      .fill(contest.config.mainSiteUrl);
  }

  await page
    .locator('input[name="mainsite"]')
    .fill(contest.config.mainSiteNumber.toString());

  if (contest.config.localSiteNumber !== undefined) {
    await page
      .locator('input[name="localsite"]')
      .fill(contest.config.localSiteNumber.toString());
  } else {
    await page
      .locator('input[name="localsite"]')
      .fill(contest.config.mainSiteNumber.toString());
  }
}

export async function createContest(
  page: Page,
  contest: ContestModel
): Promise<void> {
  await fillContest(page, contest);
  page.once('dialog', (dialog: Dialog) => {
    dialog.accept().catch(() => {
      console.error('Dialog was already closed when accepted');
    });
  });
  if (contest.config.active) {
    await page.getByRole('button', { name: 'Activate' }).click();
  } else {
    await page.getByRole('button', { name: 'Send' }).click();
  }
}

export async function updateContest(
  page: Page,
  contest: ContestModel
): Promise<void> {
  await fillContest(page, contest);
  page.once('dialog', (dialog: Dialog) => {
    dialog.accept().catch(() => {
      console.error('Dialog was already closed when accepted');
    });
  });
  await page.getByRole('button', { name: 'Send' }).click();
}

export async function clearContest(
  page: Page,
  contest: ContestModel
): Promise<void> {
  await page.goto(BASE_URL + '/system/');
  await page.getByRole('link', { name: 'Contest' }).click();
  await page
    .locator('select[name="contest"]')
    .selectOption(contest.config.id?.toString() ?? 'new');
  await page.getByRole('button', { name: 'Clear' }).click();

  page.once('dialog', (dialog: Dialog) => {
    dialog.accept().catch(() => {
      console.error('Dialog was already closed when accepted');
    });
  });
}
