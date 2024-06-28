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

import { type Locator, type Page } from 'playwright';
import { type Answer } from '../data/answer';
import { AnswerError, AnswerMessages } from '../errors/read_errors';
import { BASE_URL } from '../index';
import { dialogHandler } from '../utils/handlers';

export async function createAnswer(
  page: Page,
  answer: Answer
): Promise<Answer> {
  await page.goto(BASE_URL + '/admin/answer.php');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  await checkAnswerNotExists(page, answer.id);
  await fillAnswerForm(page, answer);
  page.on('dialog', dialogHandler);
  await page.getByRole('button', { name: 'Send' }).click();
  page.removeListener('dialog', dialogHandler);
  return await getAnswer(page, answer.id);
}

export async function deleteAnswer(
  page: Page,
  id: Answer['id']
): Promise<Answer> {
  await page.goto(BASE_URL + '/admin/answer.php');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  const row = await checkAnswerExists(page, id);
  const link = await row.locator('td:nth-of-type(1) > a');
  if ((await link.count()) === 0)
    throw new AnswerError(AnswerMessages.CANNOT_DELETE);
  const answer: Answer = await getAnswerFromRow(page, id);
  page.on('dialog', dialogHandler);
  await link.click();
  page.removeListener('dialog', dialogHandler);
  return answer;
}

export async function getAnswer(page: Page, id: Answer['id']): Promise<Answer> {
  await page.goto(BASE_URL + '/admin/answer.php');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  return await getAnswerFromRow(page, id);
}

export async function getAnswers(page: Page): Promise<Answer[]> {
  await page.goto(BASE_URL + '/admin/answer.php');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  const re = new RegExp(`^(Answer #|0 \\(fake\\))$`);
  const loc = page.locator('td:nth-of-type(1)', {
    hasNotText: re
  });
  const rows = await page.locator('table:nth-of-type(3) > tbody > tr', {
    has: loc
  });
  const rowCount = await rows.count();
  const answers: Answer[] = [];
  for (let i = 0; i < rowCount; i++) {
    const row = rows.nth(i);
    answers.push({
      id: await row.locator('td:nth-of-type(1)').innerText(),
      description: await row.locator('td:nth-of-type(2)').innerText(),
      shortname: await row.locator('td:nth-of-type(3)').innerText(),
      type: (await row
        .locator('td:nth-of-type(4)')
        .innerText()) as Answer['type']
    });
  }
  return answers;
}

export async function updateAnswer(
  page: Page,
  answer: Answer
): Promise<Answer> {
  await page.goto(BASE_URL + '/admin/answer.php');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  await checkAnswerExists(page, answer.id);
  await fillAnswerForm(page, answer);
  page.on('dialog', dialogHandler);
  await page.locator('input[name="Submit3"]').click();
  page.removeListener('dialog', dialogHandler);
  return await getAnswer(page, answer.id);
}

async function checkAnswerExists(page: Page, id: string): Promise<Locator> {
  const loc = 'td:nth-of-type(1)';
  const row = await page.locator('table:nth-of-type(3) > tbody > tr', {
    has: page.locator(loc, { hasText: id })
  });
  if ((await row.count()) === 0) {
    throw new AnswerError(AnswerMessages.NOT_FOUND);
  }
  return row;
}

async function checkAnswerNotExists(page: Page, id: string): Promise<Locator> {
  const loc = 'td:nth-of-type(1)';
  const row = await page.locator('table:nth-of-type(3) > tbody > tr', {
    has: page.locator(loc, { hasText: id })
  });
  if ((await row.count()) > 0) {
    throw new AnswerError(AnswerMessages.ID_ALREADY_IN_USE);
  }
  return row;
}

async function fillAnswerForm(page: Page, answer: Answer): Promise<void> {
  await page.locator("input[name='answernumber']").fill(answer.id);
  await page.locator("input[name='answername']").fill(answer.description);
  if (answer.shortname !== undefined) {
    await page.locator("input[name='answershort']").fill(answer.shortname);
  }
  if (answer.type !== undefined) {
    await page
      .locator('select[name="answeryes"]')
      .selectOption({ label: answer.type });
  }
}

async function getAnswerFromRow(page: Page, id: Answer['id']): Promise<Answer> {
  const answer: Answer = {} as Answer;
  const row = await checkAnswerExists(page, id);
  answer.id = await row.locator('td:nth-of-type(1)').innerText();
  answer.description = await row.locator('td:nth-of-type(2)').innerText();
  answer.shortname = await row.locator('td:nth-of-type(3)').innerText();
  answer.type = (await row
    .locator('td:nth-of-type(4)')
    .innerText()) as Answer['type'];
  return answer;
}
