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
import {
  type Problem,
  type CreateProblem,
  type DownloadProblem,
  type UpdateProblem
} from '../data/problem';
import { ProblemError, ProblemMessages } from '../errors/read_errors';
import { BASE_URL } from '../index';
import { dialogHandler } from '../utils/handlers';

export async function createProblem(
  page: Page,
  problem: CreateProblem
): Promise<Problem> {
  await page.goto(BASE_URL + '/admin/problem.php');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  await checkProblemNotExists(page, problem.id);
  await fillProblemForm(page, problem);
  page.once('dialog', dialogHandler);
  await page.getByRole('button', { name: 'Send' }).click();
  return await getProblem(page, problem.id);
}

export async function deleteProblem(
  page: Page,
  id: Problem['id']
): Promise<Problem> {
  await page.goto(BASE_URL + '/admin/problem.php');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  const row = await checkProblemExists(page, id);
  // Hide only if it is visible (soft delete)
  if (
    (await row.locator('td:nth-of-type(1) > a').innerText()).indexOf(
      '(deleted)'
    ) === -1
  ) {
    page.on('dialog', dialogHandler);
    // Click on the id link
    await row.locator('td:nth-of-type(1) > a').first().click();
    page.removeListener('dialog', dialogHandler);
  }
  return await getProblem(page, id);
}

export async function deleteProblems(page: Page): Promise<Problem[]> {
  await page.goto(BASE_URL + '/admin/problem.php');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  const re = new RegExp(`^(Problem #|0 \\(fake\\))$`);
  const loc = page.locator('td:nth-of-type(1)', {
    hasNotText: re
  });
  const rows = await page
    .locator('form[name=form0] > table > tbody > tr')
    .filter({ has: loc });
  const rowCount = await rows.count();
  const problems: Problem[] = [];
  // Find deletable problems
  for (let i = 0; i < rowCount; i++) {
    const row = rows.nth(i);
    const columns = await row.locator('td').all();
    const id = await columns[0].innerText();
    if (id.indexOf('(deleted)') !== -1) continue;
    problems.push(await getProblem(page, id));
  }
  // Delete them
  for (let i = 0; i < problems.length; i++) {
    // Delete problem and replace it with the deleted problem (isEnabled: No)
    problems[i] = await deleteProblem(page, problems[i].id);
  }
  // Return deleted problems
  return problems;
}

export async function downloadProblem(
  page: Page,
  problem: DownloadProblem
): Promise<void> {
  await page.goto(BASE_URL + '/admin/problem.php');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  const row = await checkProblemExists(page, problem.id);
  if (problem.downloadDescFile !== 'No') {
    const link = await row.locator('td:nth-of-type(5) > a');
    if ((await link.count()) === 0)
      throw new ProblemError(ProblemMessages.DESC_FILE_UNAVAILABLE);
    await downloadFile(page, problem.downloadDir, link);
  }

  if (problem.downloadPckgFile !== 'No') {
    const link = await row.locator('td:nth-of-type(6) > a');
    if ((await link.count()) === 0)
      throw new ProblemError(ProblemMessages.PCKG_FILE_UNAVAILABLE);
    await downloadFile(page, problem.downloadDir, link);
  }
}

export async function getProblem(
  page: Page,
  id: Problem['id']
): Promise<Problem> {
  await page.goto(BASE_URL + '/admin/problem.php');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  return await getProblemFromRow(page, id);
}

export async function getProblems(page: Page): Promise<Problem[]> {
  await page.goto(BASE_URL + '/admin/problem.php');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  const re = new RegExp(`^(Problem #|0 \\(fake\\))$`);
  const loc = page.locator('td:nth-of-type(1)', {
    hasNotText: re
  });
  const rows = await page
    .locator('form[name=form0] > table > tbody > tr')
    .filter({ has: loc });
  const rowCount = await rows.count();
  const problems: Problem[] = [];
  for (let i = 0; i < rowCount; i++) {
    const row = rows.nth(i);
    const columns = await row.locator('td').all();
    const id = await columns[0].innerText();
    problems.push(await getProblem(page, id));
  }
  return problems;
}

export async function restoreProblem(
  page: Page,
  id: Problem['id']
): Promise<Problem> {
  await page.goto(BASE_URL + '/admin/problem.php');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  const row = await checkProblemExists(page, id);
  // Show only if it is hidden (soft delete)
  if (
    (await row.locator('td:nth-of-type(1) > a').innerText()).indexOf(
      '(deleted)'
    ) !== -1
  ) {
    page.on('dialog', dialogHandler);
    // Click on the id link
    await row.locator('td > a').first().click();
    page.removeListener('dialog', dialogHandler);
  }
  return await getProblem(page, id);
}

export async function restoreProblems(page: Page): Promise<Problem[]> {
  await page.goto(BASE_URL + '/admin/problem.php');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  const re = new RegExp(`^(Problem #|0 \\(fake\\))$`);
  const loc = page.locator('td:nth-of-type(1)', {
    hasNotText: re
  });
  const rows = await page
    .locator('form[name=form0] > table > tbody > tr')
    .filter({ has: loc });
  const rowCount = await rows.count();
  const problems: Problem[] = [];
  // Find restorable problems
  for (let i = 0; i < rowCount; i++) {
    const row = rows.nth(i);
    const columns = await row.locator('td').all();
    const id = await columns[0].innerText();
    if (id.indexOf('(deleted)') === -1) continue;
    problems.push(await getProblem(page, id.replace('(deleted)', '')));
  }
  // Restore them
  for (let i = 0; i < problems.length; i++) {
    // Restore problem and replace it with the restored problem (isEnabled: Yes)
    problems[i] = await restoreProblem(page, problems[i].id);
  }
  // Return restored problems
  return problems;
}

export async function updateProblem(
  page: Page,
  problem: UpdateProblem
): Promise<Problem> {
  await page.goto(BASE_URL + '/admin/problem.php');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  const row = await checkProblemExists(page, problem.id!);
  if (problem.name !== undefined || problem.filePath !== undefined) {
    // Update using the form to create
    await fillProblemForm(page, problem as CreateProblem);
    page.once('dialog', dialogHandler);
    await page.getByRole('button', { name: 'Send' }).click();
  } else {
    // Update using the inline color form
    await fillColorForm(row, problem as CreateProblem);
    await row.locator('input[name="SubmitProblem' + problem.id + '"]').click();
  }
  return await getProblem(page, problem.id!);
}

async function checkProblemExists(page: Page, id: string): Promise<Locator> {
  const re = new RegExp(`^${id}[\\(deleted\\)]*$`);
  const row = await page.locator('form[name=form0] > table > tbody > tr', {
    has: page.locator('td:nth-of-type(1)', { hasText: re })
  });
  if ((await row.count()) === 0) {
    throw new ProblemError(ProblemMessages.NOT_FOUND);
  }
  return row;
}

async function checkProblemNotExists(page: Page, id: string): Promise<Locator> {
  // const re = new RegExp(`^${id}[\\(deleted\\)]*$`);
  // Check if the id is being used by an active/enabled problem
  const re = new RegExp(`^${id}$`);
  const row = await page.locator('form[name=form0] > table > tbody > tr', {
    has: page.locator('td:nth-of-type(1)', { hasText: re })
  });
  if ((await row.count()) > 0) {
    throw new ProblemError(ProblemMessages.ID_ALREADY_IN_USE);
  }
  return row;
}

async function downloadFile(
  page: Page,
  path: string | undefined,
  link: Locator
): Promise<void> {
  // Start waiting for download before clicking. Note no await.
  const downloadPromise = page.waitForEvent('download');
  await link.click();
  const download = await downloadPromise;

  // Wait for the download process to complete and save the downloaded
  // file somewhere.
  const dir = path !== undefined ? path : './';
  const filename = download.suggestedFilename();
  await download.saveAs(`${dir}/${filename}`);
}

async function fillColorForm(
  row: Locator,
  problem: CreateProblem
): Promise<void> {
  if (problem.colorName != undefined) {
    await row
      .locator('input[name="colorname' + problem.id + '"]')
      .fill(problem.colorName);
  }
  if (problem.colorCode != undefined) {
    await row
      .locator('input[name="color' + problem.id + '"]')
      .fill(problem.colorCode);
  }
}

async function fillProblemForm(
  page: Page,
  problem: CreateProblem
): Promise<void> {
  await page.locator('input[name="problemnumber"]').fill(problem.id.toString());
  await page.locator('input[name="problemname"]').fill(problem.name);
  await page
    .locator('input[name="probleminput"]')
    .setInputFiles(problem.filePath);
  if (problem.colorName != undefined) {
    await page.locator('input[name="colorname"]').fill(problem.colorName);
  }
  if (problem.colorCode != undefined) {
    await page.locator('input[name="color"]').fill(problem.colorCode);
  }
}

async function getProblemFromRow(
  page: Page,
  id: Problem['id']
): Promise<Problem> {
  const problem = {} as Required<Problem>;
  const re = new RegExp(`^${id}[\\(deleted\\)]*$`);
  const row = await page.locator('form[name=form0] > table > tbody > tr', {
    has: page.locator('td:nth-of-type(1)', { hasText: re })
  });
  if ((await row.count()) === 0)
    throw new ProblemError(ProblemMessages.NOT_FOUND);
  const columns = await row
    .locator('td')
    .filter({ hasNot: page.locator('[for*="autojudge"], [id*="autojudge"]') }) // Filter out autojudge elements
    .all();
  problem.id = (await columns[0].innerText()).replace('(deleted)', '');
  problem.name = await columns[1].innerText();
  problem.filePath = (await columns[5].innerText()).trim();
  problem.colorName = await columns[6]
    .locator('input[type=text]:nth-child(2)')
    .inputValue();
  problem.colorCode = await columns[6]
    .locator('input[type=text]:nth-child(3)')
    .inputValue();
  problem.isEnabled = (await columns[0].innerText()).endsWith('(deleted)')
    ? 'No'
    : 'Yes';
  return problem;
}
