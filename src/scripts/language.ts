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

import { BASE_URL } from '../index';
import { type Language } from '../data/language';
import { type Dialog, type Page } from 'playwright';

export async function createLanguage(
  page: Page,
  language: Language
): Promise<void> {
  await page.goto(BASE_URL + '/admin/language.php');
  await page.locator("input[name='langnumber']").fill(language.id.toString());
  await page.locator("input[name='langname']").fill(language.name);
  await page.locator("input[name='langextension']").fill(language.extension);
  await page.locator("input[name='Submit3']").click();
}

export async function deleteLanguage(
  page: Page,
  language: Language
): Promise<void> {
  await page.goto(BASE_URL + '/admin/language.php');

  page.on('dialog', (dialog: Dialog) => {
    dialog.accept().catch(() => {
      console.error('Dialog was already closed when dismissed');
    });
  });

  const el = page.locator('td:nth-of-type(2)', { hasText: language.name });

  await page
    .locator('table:nth-of-type(3) > tbody > tr', { has: el })
    .locator('td:nth-of-type(1) a')
    .click();
}
