// =======================================================================
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
import { type Auth } from '../data/auth';
import { type User, type GetUser } from '../data/user';
import { UserError, UserMessages } from '../errors/read_errors';
import { BASE_URL } from '../index';
import { dialogHandler } from '../utils/handlers';

export async function createUser(
  page: Page,
  user: User,
  admin: Auth
): Promise<User> {
  await page.goto(`${BASE_URL}/admin/user.php`);
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  await checkUserNotExists(page, user);
  await fillUserForm(page, user, admin);
  page.once('dialog', dialogHandler);
  await page.getByRole('button', { name: 'Send' }).click();
  return await getUser(page, user);
}

export async function deleteUser(
  page: Page,
  user: GetUser,
  admin: Auth
): Promise<User> {
  await page.goto(BASE_URL + '/admin/user.php');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  const row = await checkUserExists(page, user);
  if (await row.locator('td:nth-of-type(1) a').isVisible()) {
    await row.locator('td:nth-of-type(1) a').click();
    // Wait for load state
    await page.waitForLoadState('domcontentloaded');

    // Delete/Disable only if it is active/enabled (soft delete)
    if (
      (await row.locator('td:nth-of-type(1)').innerText()).indexOf(
        '(inactive)'
      ) === -1
    ) {
      if (await page.isVisible('input[name="passwordo"]')) {
        await page.locator('input[name="passwordo"]').fill(admin.password);
      }

      page.once('dialog', dialogHandler);
      await page.getByRole('button', { name: 'Delete' }).click();
    }
    return await getUser(page, user);
  } else {
    throw new UserError(UserMessages.CANNOT_DELETE);
  }
}

export async function getUser(page: Page, user: GetUser): Promise<User> {
  await page.goto(`${BASE_URL}/admin/user.php`);
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  const row = await checkUserExists(page, user);
  if (await row.locator('td:nth-of-type(1) a').isVisible()) {
    await row.locator('td:nth-of-type(1) a').click();
    return await getUserFromForm(page);
  } else {
    return await getUserFromRow(row);
  }
}

export async function getUsers(page: Page): Promise<User[]> {
  await page.goto(`${BASE_URL}/admin/user.php`);
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  const thead = 'User #';
  const loc1 = page.locator('tr > td:nth-of-type(1)', {
    hasText: thead
  });
  const loc2 = page.locator('td:nth-of-type(1)', {
    hasNotText: thead
  });
  const rows = await page
    .locator('table')
    .filter({ has: loc1 })
    .locator('tr')
    .filter({ has: loc2 });
  const rowCount = await rows.count();
  const users: User[] = [];
  for (let i = 0; i < rowCount; i++) {
    const row = rows.nth(i);
    if (await row.locator('td:nth-of-type(1) a').isVisible()) {
      await row.locator('td:nth-of-type(1) a').click();
      const user: User = await getUserFromForm(page);
      users.push(user);
    } else {
      users.push(await getUserFromRow(row));
    }
  }
  return users;
}

export async function importUsers(page: Page, path: string): Promise<void> {
  await page.goto(`${BASE_URL}/admin/user.php`);
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  await page.locator('input[name="importfile"]').click();
  await page.locator('input[name="importfile"]').setInputFiles(path);
  page.once('dialog', dialogHandler);
  await page.getByRole('button', { name: 'Import' }).click();
}

export async function restoreUser(
  page: Page,
  user: GetUser,
  admin: Auth
): Promise<User> {
  await page.goto(BASE_URL + '/admin/user.php');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  const row = await checkUserExists(page, user);
  if (await row.locator('td:nth-of-type(1) a').isVisible()) {
    await row.locator('td:nth-of-type(1) a').click();
    // Wait for load state
    await page.waitForLoadState('domcontentloaded');

    // Restore/Enable only if it is deleted/disabled (soft delete)
    if (
      (await row.locator('td:nth-of-type(1)').innerText()).indexOf(
        '(inactive)'
      ) !== -1
    ) {
      await page
        .locator('select[name="userenabled"]')
        .selectOption({ label: 'Yes' });

      if (await page.isVisible('input[name="passwordo"]')) {
        await page.locator('input[name="passwordo"]').fill(admin.password);
      }

      page.once('dialog', dialogHandler);
      await page.getByRole('button', { name: 'Send' }).click();
    }
  }
  return await getUser(page, user);
}

export async function updateUser(
  page: Page,
  user: User,
  admin: Auth
): Promise<User> {
  await page.goto(`${BASE_URL}/admin/user.php`);
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  await checkUserExists(page, user);
  await fillUserForm(page, user, admin);
  page.once('dialog', dialogHandler);
  await page.getByRole('button', { name: 'Send' }).click();
  return await getUser(page, user);
}

function capitalize(s: unknown) {
  if (typeof s === 'string' || s instanceof String)
    return s[0].toUpperCase() + s.slice(1);
  else return s;
}

async function checkUserExists(page: Page, user: GetUser): Promise<Locator> {
  const re = new RegExp(`^${user.id}[\\(inactive\\)]*$`);
  const loc1 = page.locator('td:nth-of-type(1)', {
    // eslint-disable-next-line no-useless-escape
    hasText: re
  });
  const loc2 = page.locator('td:nth-of-type(2)', {
    // eslint-disable-next-line no-useless-escape
    hasText: user.siteId
  });
  const row = await page
    .locator('tr')
    .filter({ has: loc1 })
    .filter({ has: loc2 });
  if ((await row.count()) === 0) {
    throw new UserError(UserMessages.NOT_FOUND);
  }
  return row;
}

async function checkUserNotExists(page: Page, user: GetUser): Promise<Locator> {
  const re = new RegExp(`^${user.id}$`);
  const loc1 = page.locator('td:nth-of-type(1)', {
    // eslint-disable-next-line no-useless-escape
    hasText: re
  });
  const loc2 = page.locator('td:nth-of-type(2)', {
    // eslint-disable-next-line no-useless-escape
    hasText: user.siteId
  });
  const row = await page
    .locator('tr')
    .filter({ has: loc1 })
    .filter({ has: loc2 });
  if ((await row.count()) > 0) {
    throw new UserError(UserMessages.ID_AND_SITE_ALREADY_IN_USE);
  }
  return row;
}

async function fillUserForm(
  page: Page,
  user: User,
  admin: Auth
): Promise<void> {
  if (user.siteId != undefined) {
    await page
      .locator('input[name="usersitenumber"]')
      .fill(user.siteId.toString());
  }
  await page.locator('input[name="usernumber"]').fill(user.id);
  await page.locator('input[name="username"]').fill(user.username);
  if (user.icpcId != undefined) {
    await page.locator('input[name="usericpcid"]').fill(user.icpcId);
  }
  if (user.type !== undefined) {
    await page
      .locator('select[name="usertype"]')
      .selectOption({ label: user.type });
  }
  if (user.isEnabled !== undefined) {
    await page
      .locator('select[name="userenabled"]')
      .selectOption({ label: user.isEnabled });
  }
  if (user.isMultiLogin !== undefined) {
    await page
      .locator('select[name="usermultilogin"]')
      .selectOption({ label: user.isMultiLogin });
  }
  if (user.fullName !== undefined) {
    await page.locator('input[name="userfullname"]').fill(user.fullName);
  }
  if (user.description !== undefined) {
    await page.locator('input[name="userdesc"]').fill(user.description);
  }
  if (user.ip !== undefined) {
    await page.locator('input[name="userip"]').fill(user.ip);
  }
  if (
    (await page.isVisible('input[name="passwordn1"]')) &&
    user.password !== undefined
  ) {
    await page.locator('input[name="passwordn1"]').fill(user.password);
    await page.locator('input[name="passwordn2"]').fill(user.password);
  }
  if (user.allowPasswordChange !== undefined) {
    await page
      .locator('select[name="changepass"]')
      .selectOption({ label: user.allowPasswordChange });
  }
  if (await page.isVisible('input[name="passwordo"]')) {
    await page.locator('input[name="passwordo"]').fill(admin.password);
  }
}

async function getUserFromForm(page: Page): Promise<User> {
  const user: User = {} as User;
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  if (await page.locator('input[name="usernumber"]').isVisible()) {
    user.id = await page.locator('input[name="usernumber"]').inputValue();
  }
  if (await page.locator('input[name="usersitenumber"]').isVisible()) {
    user.siteId = await page
      .locator('input[name="usersitenumber"]')
      .inputValue();
  }
  if (await page.locator('input[name="username"]').isVisible()) {
    user.username = await page.locator('input[name="username"]').inputValue();
  }
  if (await page.locator('input[name="usericpcid"]').isVisible()) {
    user.icpcId = await page.locator('input[name="usericpcid"]').inputValue();
  }
  if (await page.locator('select[name="usertype"]').isVisible()) {
    user.type = capitalize(
      (await page.locator('select[name="usertype"]').inputValue()) as string
    ) as User['type'];
  }
  if (await page.locator('select[name="userenabled"]').isVisible()) {
    user.isEnabled =
      (await page.locator('select[name="userenabled"]').inputValue()) === 't'
        ? 'Yes'
        : 'No';
  }
  if (await page.locator('select[name="usermultilogin"]').isVisible()) {
    user.isMultiLogin =
      (await page.locator('select[name="usermultilogin"]').inputValue()) === 't'
        ? 'Yes'
        : 'No';
  }
  if (await page.locator('input[name="userfullname"]').isVisible()) {
    user.fullName = await page
      .locator('input[name="userfullname"]')
      .inputValue();
  }
  if (await page.locator('input[name="userdesc"]').isVisible()) {
    user.description = await page
      .locator('input[name="userdesc"]')
      .inputValue();
  }
  if (await page.locator('input[name="userip"]').isVisible()) {
    user.ip = await page.locator('input[name="userip"]').inputValue();
  }
  if (await page.locator('select[name="changepass"]').isVisible()) {
    user.allowPasswordChange =
      (await page.locator('select[name="changepass"]').inputValue()) === 't'
        ? 'Yes'
        : 'No';
  }
  return user;
}

async function getUserFromRow(row: Locator): Promise<User> {
  return {
    id: (await row.locator('td:nth-of-type(1)').textContent())
      ?.trim()
      .replace('(inactive)', ''),
    siteId: (await row.locator('td:nth-of-type(2)').textContent())?.trim(),
    username: (await row.locator('td:nth-of-type(3)').textContent())?.trim(),
    icpcId: (await row.locator('td:nth-of-type(4)').textContent())?.trim(),
    type: capitalize(
      (await row.locator('td:nth-of-type(5)').textContent())?.trim()
    ),
    isEnabled: (await row.locator('td:nth-of-type(9)').textContent())?.trim(),
    isMultiLogin: (
      await row.locator('td:nth-of-type(10)').textContent()
    )?.trim(),
    fullName: (await row.locator('td:nth-of-type(11)').textContent())?.trim(),
    description: (
      await row.locator('td:nth-of-type(12)').textContent()
    )?.trim(),
    ip: (await row.locator('td:nth-of-type(6)').textContent())?.trim()
  } as User;
}
