import { type Dialog, type Page } from 'playwright';
import { type LoginModel } from '../data/login';
import { type UserModel } from '../data/user';
import { BASE_URL } from '../index';

export async function login (page: Page, login: LoginModel): Promise<void> {
  await page.goto(BASE_URL + '/');
  await page.locator('input[name="name"]').click();
  await page.locator('input[name="name"]').fill(login.username);
  await page.locator('input[name="name"]').press('Tab');
  await page.locator('input[name="password"]').fill(login.password);
  await page.locator('input[name="password"]').press('Enter');
}

export async function insertUsers (page: Page, path: string): Promise<void> {
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

async function fillUser (page: Page, user: UserModel, admin: LoginModel): Promise<void> {
  await page.goto(`${BASE_URL}/admin/user.php`);
  await page.locator('input[name="usersitenumber"]').fill(user.userSiteNumber?.toString() ?? '1');
  await page.locator('input[name="usernumber"]').fill(user.userNumber);
  await page.locator('input[name="username"]').fill(user.userName);
  if (user.userIcpcId != null) { await page.locator('input[name="usericpcid"]').fill(user.userIcpcId); }
  await page.locator('select[name="usertype"]').selectOption({ label: user.userType });
  if (user.userEnabled !== undefined) { await page.locator('select[name="userenabled"]').selectOption({ label: user.userEnabled }); }
  if (user.userMultiLogin !== undefined) { await page.locator('select[name="usermultilogin"]').selectOption({ label: user.userMultiLogin }); }
  await page.locator('input[name="userfullname"]').fill(user.userFullName);
  await page.locator('input[name="userdesc"]').fill(user.userDesc);
  if (user.userIp !== undefined) { await page.locator('input[name="userip"]').fill(user.userIp); }
  if (user.userPassword !== undefined) {
    await page.locator('input[name="passwordn1"]').fill(user.userPassword);
    await page.locator('input[name="passwordn2"]').fill(user.userPassword);
  }
  if (user.userChangePass !== undefined) { await page.locator('select[name="changepass"]').selectOption({ label: user.userChangePass }); }
  await page.locator('input[name="passwordo"]').fill(admin.password);
}

export async function createUser (page: Page, user: UserModel, admin: LoginModel): Promise<void> {
  await fillUser(page, user, admin);
  page.once('dialog', (dialog: Dialog) => {
    dialog.accept().catch(() => {
      console.error('Dialog was already closed when accepted');
    });
  });
  await page.getByRole('button', { name: 'Send' }).click();
}

export async function deleteUser (page: Page, user: UserModel, admin: LoginModel): Promise<void> {
  await page.goto(BASE_URL + '/admin/user.php');

  await page.locator('tr', {
    has: page.locator('td', { hasText: user.userName })
  }).locator('td').nth(0).click();

  await page.locator('input[name="passwordo"]').fill(admin.password);

  page.once('dialog', (dialog: Dialog) => {
    dialog.accept()
      .catch(() => { console.error('Dialog was already closed when accepted'); });
  });
  await page.getByRole('button', { name: 'Delete' }).click();
}
