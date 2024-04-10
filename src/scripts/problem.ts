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
import { BASE_URL } from '../index';
import { type Problem } from '../data/problem';

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
): Promise<void> {
  await fillProblems(page, problem);
  page.once('dialog', (dialog: Dialog) => {
    dialog.accept().catch(() => {
      console.error('Dialog was already closed when dismissed');
    });
  });
  await page.getByRole('button', { name: 'Send' }).click();
}
