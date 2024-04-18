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

import { type Dialog, type Page } from 'playwright';
import { type Login } from '../data/login';
import { type User } from '../data/user';
import { BASE_URL } from '../index';

export async function login(page: Page, login: Login): Promise<void> {
  await page.goto(BASE_URL + '/');
  await page.locator('input[name="name"]').click();
  await page.locator('input[name="name"]').fill(login.username);
  await page.locator('input[name="name"]').press('Tab');
  await page.locator('input[name="password"]').fill(login.password);
  await page.locator('input[name="password"]').press('Enter');
}

export async function insertUsers(page: Page, path: string): Promise<void> {
  await page.goto(`${BASE_URL}/admin/user.php`);
  await page.locator('input[name="importfile"]').click();
  await page.locator('input[name="importfile"]').setInputFiles(path);
  page.once('dialog', (dialog: Dialog) => {
    dialog.accept().catch(() => {
      console.error('Dialog was already closed when accepted');
    });
  });
  await page.getByRole('button', { name: 'Import' }).click();
}

async function fillUser(page: Page, user: User, admin: Login): Promise<void> {
  await page.goto(`${BASE_URL}/admin/user.php`);
  await page
    .locator('input[name="usersitenumber"]')
    .fill(user.userSiteNumber?.toString() ?? '1');
  await page.locator('input[name="usernumber"]').fill(user.userNumber);
  await page.locator('input[name="username"]').fill(user.userName);
  if (user.userIcpcId != null) {
    await page.locator('input[name="usericpcid"]').fill(user.userIcpcId);
  }
  await page
    .locator('select[name="usertype"]')
    .selectOption({ label: user.userType });
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
  await page.locator('input[name="userfullname"]').fill(user.userFullName);
  await page.locator('input[name="userdesc"]').fill(user.userDesc);
  if (user.userIp !== undefined) {
    await page.locator('input[name="userip"]').fill(user.userIp);
  }
  if (user.userPassword !== undefined) {
    await page.locator('input[name="passwordn1"]').fill(user.userPassword);
    await page.locator('input[name="passwordn2"]').fill(user.userPassword);
  }
  if (user.userChangePass !== undefined) {
    await page
      .locator('select[name="changepass"]')
      .selectOption({ label: user.userChangePass });
  }
  await page.locator('input[name="passwordo"]').fill(admin.password);
}

export async function createUser(
  page: Page,
  user: User,
  admin: Login
): Promise<void> {
  await fillUser(page, user, admin);
  page.once('dialog', (dialog: Dialog) => {
    dialog.accept().catch(() => {
      console.error('Dialog was already closed when accepted');
    });
  });
  await page.getByRole('button', { name: 'Send' }).click();
}

export async function deleteUser(
  page: Page,
  userName: string,
  admin: Login
): Promise<void> {
  await page.goto(BASE_URL + '/admin/user.php');

  await page
    .locator('tr', {
      has: page.locator('td', { hasText: userName })
    })
    .locator('td')
    .nth(0)
    .click();

  await page.locator('input[name="passwordo"]').fill(admin.password);

  page.once('dialog', (dialog: Dialog) => {
    dialog.accept().catch(() => {
      console.error('Dialog was already closed when accepted');
    });
  });
  await page.getByRole('button', { name: 'Delete' }).click();
}
