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
import { type Language } from '../data/language';
import { LanguageError, LanguageMessages } from '../errors/read_errors';
import { BASE_URL } from '../index';
import { dialogHandler } from '../utils/handlers';

export async function createLanguage(
  page: Page,
  language: Language
): Promise<Language> {
  await page.goto(BASE_URL + '/admin/language.php');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  await checkLanguageNotExists(page, language.id);
  await fillLanguageForm(page, language);
  page.on('dialog', dialogHandler);
  await page.getByRole('button', { name: 'Send' }).click();
  page.removeListener('dialog', dialogHandler);
  return await getLanguage(page, language.id);
}

export async function deleteLanguage(
  page: Page,
  id: Language['id']
): Promise<Language> {
  await page.goto(BASE_URL + '/admin/language.php');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  const row = await checkLanguageExists(page, id);
  const language: Language = await getLanguageFromRow(page, id);
  page.on('dialog', dialogHandler);
  await row.locator('td:nth-of-type(1) a').click();
  page.removeListener('dialog', dialogHandler);
  return language;
}

export async function getLanguage(
  page: Page,
  id: Language['id']
): Promise<Language> {
  await page.goto(BASE_URL + '/admin/language.php');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  return await getLanguageFromRow(page, id);
}

export async function getLanguages(page: Page): Promise<Language[]> {
  await page.goto(BASE_URL + '/admin/language.php');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  const loc = page.locator('td:nth-of-type(1)', {
    hasNotText: 'Language #'
  });
  const rows = await page.locator('table:nth-of-type(3) > tbody > tr', {
    has: loc
  });
  const rowCount = await rows.count();
  const languages: Language[] = [];
  for (let i = 0; i < rowCount; i++) {
    const row = rows.nth(i);
    languages.push({
      id: await row.locator('td:nth-of-type(1)').innerText(),
      name: await row.locator('td:nth-of-type(2)').innerText(),
      extension: await row.locator('td:nth-of-type(3)').innerText()
    });
  }
  return languages;
}

export async function updateLanguage(
  page: Page,
  language: Language
): Promise<Language> {
  await page.goto(BASE_URL + '/admin/language.php');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  await checkLanguageExists(page, language.id);
  await fillLanguageForm(page, language);
  page.on('dialog', dialogHandler);
  await page.locator('input[name="Submit3"]').click();
  page.removeListener('dialog', dialogHandler);
  return await getLanguage(page, language.id);
}

async function checkLanguageExists(page: Page, id: string): Promise<Locator> {
  const loc = 'td:nth-of-type(1)';
  const row = await page.locator('table:nth-of-type(3) > tbody > tr', {
    has: page.locator(loc, { hasText: id })
  });
  if ((await row.count()) === 0) {
    throw new LanguageError(LanguageMessages.NOT_FOUND);
  }
  return row;
}

async function checkLanguageNotExists(
  page: Page,
  id: string
): Promise<Locator> {
  const loc = 'td:nth-of-type(1)';
  const row = await page.locator('table:nth-of-type(3) > tbody > tr', {
    has: page.locator(loc, { hasText: id })
  });
  if ((await row.count()) > 0) {
    throw new LanguageError(LanguageMessages.ID_ALREADY_IN_USE);
  }
  return row;
}

async function fillLanguageForm(page: Page, language: Language): Promise<void> {
  await page.locator("input[name='langnumber']").fill(language.id);
  await page.locator("input[name='langname']").fill(language.name);
  if (language.extension !== undefined) {
    await page.locator("input[name='langextension']").fill(language.extension);
  }
}

async function getLanguageFromRow(
  page: Page,
  id: Language['id']
): Promise<Language> {
  const language: Language = {} as Language;
  const row = await checkLanguageExists(page, id);
  language.id = await row.locator('td:nth-of-type(1)').innerText();
  language.name = await row.locator('td:nth-of-type(2)').innerText();
  language.extension = await row.locator('td:nth-of-type(3)').innerText();
  return language;
}
