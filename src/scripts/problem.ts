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
import { type ProblemId, type Problem } from '../data/problem';
import { dialogHandler } from '../utils/handlers';
import { ProblemError, ProblemMessages } from '../errors/read_errors';

async function fillProblems(page: Page, problem: Problem): Promise<void> {
  await page.goto(BASE_URL + '/admin/');
  await page.getByRole('link', { name: 'Problems' }).click();
  await page.locator('input[name="problemnumber"]').fill(problem.id.toString());
  await page.locator('input[name="problemname"]').fill(problem.name);
  await page
    .locator('input[name="probleminput"]')
    .setInputFiles(problem.filePath);
  if (problem.colorName != null) {
    await page.locator('input[name="colorname"]').fill(problem.colorName);
  }
  if (problem.colorCode != null) {
    await page.locator('input[name="color"]').fill(problem.colorCode);
  }

  await page.locator('center').filter({ hasText: 'Send' }).click();
}

export async function createProblem(
  page: Page,
  problem: Problem
): Promise<Problem> {
  await fillProblems(page, problem);
  page.once('dialog', dialogHandler);
  await page.getByRole('button', { name: 'Send' }).click();
  return await getProblem(page, problem);
}

export async function deleteProblem(
  page: Page,
  problem: ProblemId
): Promise<Problem> {
  await page.goto(BASE_URL + '/admin/problem.php');

  const identifier =
    problem.id !== undefined && problem.name == undefined
      ? problem.id
      : problem.name;
  const re = new RegExp(`^${identifier}[\\(deleted\\)]*$`);

  const row = await page.locator('form[name=form0] > table > tbody > tr', {
    has: page.locator('td', { hasText: re })
  });

  if ((await row.count()) == 0)
    throw new ProblemError(ProblemMessages.NOT_FOUND);

  page.on('dialog', dialogHandler);

  // Click on the id link
  await row.locator('td > a').first().click();
  page.removeListener('dialog', dialogHandler);
  return await getProblem(page, problem);
}

export async function getProblem(
  page: Page,
  problemId: ProblemId
): Promise<Problem> {
  await page.goto(BASE_URL + '/admin/problem.php');
  const problem = {} as Required<Problem>;

  const identifier =
    problemId.id !== undefined && problemId.name == undefined
      ? problemId.id
      : problemId.name;
  const re = new RegExp(`^${identifier}[\\(deleted\\)]*$`);

  const row = await page.locator('form[name=form0] > table > tbody > tr', {
    has: page.locator('td', { hasText: re })
  });
  if ((await row.count()) == 0)
    throw new ProblemError(ProblemMessages.NOT_FOUND);
  const columns = await row
    .locator('td')
    .filter({ hasNot: page.locator('[for*="autojudge"], [id*="autojudge"]') }) // Filter out autojudge elements
    .all();
  problem.id = parseInt(await columns[0].innerText());
  problem.name = await columns[1].innerText();
  problem.filePath = (await columns[5].innerText()).trim();
  problem.colorName = await columns[6]
    .locator('input[type=text]:nth-child(2)')
    .inputValue();
  problem.colorCode = await columns[6]
    .locator('input[type=text]:nth-child(3)')
    .inputValue();
  return problem;
}
