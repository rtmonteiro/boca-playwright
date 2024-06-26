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
import { type Page } from 'playwright';
import { dialogHandler } from '../utils/handlers';

export async function createLanguage(
  page: Page,
  language: Language
): Promise<Language> {
  await page.goto(BASE_URL + '/admin/language.php');
  await page.locator("input[name='langnumber']").fill(language.id);
  await page.locator("input[name='langname']").fill(language.name);
  await page.locator("input[name='langextension']").fill(language.extension);

  page.on('dialog', dialogHandler);

  await page.locator("input[name='Submit3']").click();

  page.removeListener('dialog', dialogHandler);

  return getLanguage(page, language.id);
}

export async function deleteLanguage(
  page: Page,
  languageId: Language['id']
): Promise<void> {
  await page.goto(BASE_URL + '/admin/language.php');

  const row = await page.locator('table:nth-of-type(3) > tbody > tr', {
    has: page.locator('td:nth-of-type(1)', { hasText: languageId })
  });

  page.on('dialog', dialogHandler);

  await row.locator('td:nth-of-type(1) a').click();

  page.removeListener('dialog', dialogHandler);
}

export async function getLanguage(
  page: Page,
  languageId: Language['id']
): Promise<Language> {
  await page.goto(BASE_URL + '/admin/language.php');

  const row = await page.locator('table:nth-of-type(3) > tbody > tr', {
    has: page.locator('td:nth-of-type(1)', { hasText: languageId })
  });

  return {
    id: await row.locator('td:nth-of-type(1)').innerText(),
    name: await row.locator('td:nth-of-type(2)').innerText(),
    extension: await row.locator('td:nth-of-type(3)').innerText()
  };
}
