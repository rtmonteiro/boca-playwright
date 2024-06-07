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
import { type Login } from '../data/login';
import { type UserId, type User } from '../data/user';
import { BASE_URL } from '../index';
import { dialogHandler } from '../utils/handlers';
import { UserError, UserMessages } from '../errors/read_errors';

async function fillUser(page: Page, user: User, admin: Login): Promise<void> {
  await page.goto(`${BASE_URL}/admin/user.php`);
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');
  await page
    .locator('input[name="usersitenumber"]')
    .fill(user.userSiteNumber?.toString() ?? '1');
  await page.locator('input[name="usernumber"]').fill(user.userNumber);
  await page.locator('input[name="username"]').fill(user.userName);
  if (user.userIcpcId != null) {
    await page.locator('input[name="usericpcid"]').fill(user.userIcpcId);
  }
  if (user.userType !== undefined) {
    await page
      .locator('select[name="usertype"]')
      .selectOption({ label: user.userType });
  }
  if (user.userEnabled !== undefined) {
    await page
      .locator('select[name="userenabled"]')
      .selectOption({ label: user.userEnabled });
  }
  if (user.userMultiLogin !== undefined) {
    await page
      .locator('select[name="usermultilogin"]')
      .selectOption({ label: user.userMultiLogin });
  }
  if (user.userFullName !== undefined) {
    await page.locator('input[name="userfullname"]').fill(user.userFullName);
  }
  if (user.userDesc !== undefined) {
    await page.locator('input[name="userdesc"]').fill(user.userDesc);
  }
  if (user.userIp !== undefined) {
    await page.locator('input[name="userip"]').fill(user.userIp);
  }
  if (
    (await page.isVisible('input[name="passwordn1"]')) &&
    user.userPassword !== undefined
  ) {
    await page.locator('input[name="passwordn1"]').fill(user.userPassword);
    await page.locator('input[name="passwordn2"]').fill(user.userPassword);
  }
  if (user.userChangePass !== undefined) {
    await page
      .locator('select[name="changepass"]')
      .selectOption({ label: user.userChangePass });
  }
  if (await page.isVisible('input[name="passwordo"]')) {
    await page.locator('input[name="passwordo"]').fill(admin.password);
  }
}

function capitalize(s: unknown) {
  if (typeof s === 'string' || s instanceof String)
    return s[0].toUpperCase() + s.slice(1);
  else return s;
}

async function getUserFromForm(page: Page): Promise<User> {
  const user: User = {} as User;
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  if (await page.locator('input[name="usersitenumber"]').isVisible()) {
    user.userSiteNumber = await page
      .locator('input[name="usersitenumber"]')
      .inputValue();
  }
  if (await page.locator('input[name="usernumber"]').isVisible()) {
    user.userNumber = await page
      .locator('input[name="usernumber"]')
      .inputValue();
  }
  if (await page.locator('input[name="username"]').isVisible()) {
    user.userName = await page.locator('input[name="username"]').inputValue();
  }
  if (await page.locator('input[name="usericpcid"]').isVisible()) {
    user.userIcpcId = await page
      .locator('input[name="usericpcid"]')
      .inputValue();
  }
  if (await page.locator('select[name="usertype"]').isVisible()) {
    user.userType = capitalize(
      (await page.locator('select[name="usertype"]').inputValue()) as string
    ) as User['userType'];
  }
  if (await page.locator('select[name="userenabled"]').isVisible()) {
    user.userEnabled =
      (await page.locator('select[name="userenabled"]').inputValue()) === 't'
        ? 'Yes'
        : 'No';
  }
  if (await page.locator('select[name="usermultilogin"]').isVisible()) {
    user.userMultiLogin =
      (await page.locator('select[name="usermultilogin"]').inputValue()) === 't'
        ? 'Yes'
        : 'No';
  }
  if (await page.locator('input[name="userfullname"]').isVisible()) {
    user.userFullName = await page
      .locator('input[name="userfullname"]')
      .inputValue();
  }
  if (await page.locator('input[name="userdesc"]').isVisible()) {
    user.userDesc = await page.locator('input[name="userdesc"]').inputValue();
  }
  if (await page.locator('input[name="userip"]').isVisible()) {
    user.userIp = await page.locator('input[name="userip"]').inputValue();
  }
  if (await page.locator('select[name="changepass"]').isVisible()) {
    user.userChangePass =
      (await page.locator('select[name="changepass"]').inputValue()) === 't'
        ? 'Yes'
        : 'No';
  }
  return user;
}

async function getUserFromRow(row: Locator): Promise<User> {
  return {
    userSiteNumber: (
      await row.locator('td:nth-of-type(2)').textContent()
    )?.trim(),
    userNumber: (await row.locator('td:nth-of-type(1)').textContent())?.trim(),
    userName: (await row.locator('td:nth-of-type(3)').textContent())?.trim(),
    userIcpcId: (await row.locator('td:nth-of-type(4)').textContent())?.trim(),
    userType: capitalize(
      (await row.locator('td:nth-of-type(5)').textContent())?.trim()
    ),
    userEnabled: (await row.locator('td:nth-of-type(9)').textContent())?.trim(),
    userMultiLogin: (
      await row.locator('td:nth-of-type(10)').textContent()
    )?.trim(),
    userFullName: (
      await row.locator('td:nth-of-type(11)').textContent()
    )?.trim(),
    userDesc: (await row.locator('td:nth-of-type(12)').textContent())?.trim(),
    userIp: (await row.locator('td:nth-of-type(6)').textContent())?.trim()
  } as User;
}

export async function createUser(
  page: Page,
  user: User,
  admin: Login
): Promise<void> {
  await fillUser(page, user, admin);
  page.once('dialog', dialogHandler);
  await page.getByRole('button', { name: 'Send' }).click();
}

export async function deleteUser(
  page: Page,
  userId: UserId,
  admin: Login
): Promise<User> {
  await page.goto(BASE_URL + '/admin/user.php');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  const identifier = userId.userNumber;
  const re = new RegExp(`^${identifier}$`);

  const loc1 = page.locator('td:nth-of-type(1)', {
    // eslint-disable-next-line no-useless-escape
    hasText: re
  });

  const loc2 = page.locator('td:nth-of-type(2)', {
    // eslint-disable-next-line no-useless-escape
    hasText: userId.userSiteNumber
  });

  const row = await page
    .locator('tr')
    .filter({
      has: loc1
    })
    .filter({
      has: loc2
    });

  // Soft delete only if it is active
  if ((await row.count()) > 0) {
    await row.locator('td').nth(0).click();

    if (await page.isVisible('input[name="passwordo"]')) {
      await page.locator('input[name="passwordo"]').fill(admin.password);
    }

    page.once('dialog', dialogHandler);
    await page.getByRole('button', { name: 'Delete' }).click();
  }

  const user = await getUser(page, userId);
  user.userNumber = user.userNumber + '(inactive)';
  return user;
}

export async function getUser(page: Page, userId: UserId): Promise<User> {
  await page.goto(`${BASE_URL}/admin/user.php`);
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');

  const loc1 = page.locator('td:nth-of-type(1)', {
    // eslint-disable-next-line no-useless-escape
    hasText: new RegExp(`^${userId.userNumber}[\(inactive\)]*$`)
  });

  const loc2 = page.locator('td:nth-of-type(2)', {
    // eslint-disable-next-line no-useless-escape
    hasText: userId.userSiteNumber
  });

  const row = await page
    .locator('tr')
    .filter({ has: loc1 })
    .filter({ has: loc2 });

  if ((await row.count()) == 0) throw new UserError(UserMessages.NOT_FOUND);

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

  const loc1 = page.locator('tr > td:nth-of-type(1)', {
    hasText: 'User #'
  });

  const loc2 = page.locator('td:nth-of-type(1)', {
    hasNotText: 'User #'
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

export async function login(page: Page, login: Login): Promise<void> {
  await page.goto(BASE_URL + '/');
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');
  await page.locator('input[name="name"]').click();
  await page.locator('input[name="name"]').fill(login.username);
  await page.locator('input[name="name"]').press('Tab');
  await page.locator('input[name="password"]').fill(login.password);
  await page.locator('input[name="password"]').press('Enter');
}
