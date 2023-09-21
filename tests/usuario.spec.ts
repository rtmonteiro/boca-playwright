import {test, expect} from '@playwright/test';

interface AdminModel {
    username: string;
    password: string;
}

interface UsuarioModel {
    userId: string;
    userName: string;
    userFullName: string;
    userDesc: string;
    userIp: string;
    userIcpcId: string;
    userSiteNumber: string;
    userNumber: string;
    userType: 'Team' | 'Judge' | 'Admin' | 'Staff' | 'Score' | 'Site';
    userEnabled: 'Yes' | 'No';
    userMultiLogin: 'Yes' | 'No';
    userPassword: string;
    userChangePass: 'Yes' | 'No';
    adminPassword: string;
}

async function login(page, admin: AdminModel) {
    await page.goto('/boca/');
    await page.locator('input[name="name"]').click();
    await page.locator('input[name="name"]').fill(admin.username);
    await page.locator('input[name="name"]').press('Tab');
    await page.locator('input[name="password"]').fill(admin.password);
    await page.locator('input[name="password"]').press('Enter');
}

async function insertUsers(page) {
    await page.getByRole('link', { name: 'Users' }).click();
    await page.locator('input[name="importfile"]').click();
    await page.locator('input[name="importfile"]').setInputFiles('resources/BOCA_USERS.txt');
    page.once('dialog', dialog => {
      console.log(`Dialog message: ${dialog.message()}`);
      dialog.accept().catch(() => {
        console.log('Dialog was already closed when accepted');
      });
    });
    await page.getByRole('button', { name: 'Import' }).click();
}

async function fillUser(page, user: UsuarioModel) {
    await page.goto('/boca/admin/');
    await page.getByRole('link', { name: 'Users' }).click();
    await page.locator('input[name="usersitenumber"]').click();
    await page.locator('input[name="usersitenumber"]').fill(user.userSiteNumber);
    await page.locator('input[name="usernumber"]').click();
    await page.locator('input[name="usernumber"]').fill(user.userId);
    await page.locator('input[name="username"]').click();
    await page.locator('input[name="username"]').fill(user.userName);
    await page.locator('input[name="usericpcid"]').click();
    await page.locator('input[name="usericpcid"]').fill(user.userIcpcId);
    await page.locator('select[name="usertype"]').click();
    await page.locator('select[name="usertype"]').selectOption({ label: user.userType });
    await page.locator('select[name="userenabled"]').click();
    await page.locator('select[name="userenabled"]').selectOption({ label: user.userEnabled });
    await page.locator('select[name="usermultilogin"]').click();
    await page.locator('select[name="usermultilogin"]').selectOption({ label: user.userMultiLogin });
    await page.locator('input[name="userfullname"]').click();
    await page.locator('input[name="userfullname"]').fill(user.userFullName);
    await page.locator('input[name="userdesc"]').click();
    await page.locator('input[name="userdesc"]').fill(user.userDesc);
    await page.locator('input[name="userip"]').click();
    await page.locator('input[name="userip"]').fill(user.userIp);
    await page.locator('input[name="passwordn1"]').click();
    await page.locator('input[name="passwordn1"]').fill(user.userPassword);
    await page.locator('input[name="passwordn2"]').click();
    await page.locator('input[name="passwordn2"]').fill(user.userPassword);
    await page.locator('select[name="changepass"]').click();
    await page.locator('select[name="changepass"]').selectOption({ label: user.userChangePass });
    await page.locator('input[name="passwordo"]').click();
    await page.locator('input[name="passwordo"]').fill(user.adminPassword);
}

async function createUser(page, user: UsuarioModel) {
    await fillUser(page, user);
    page.once('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.accept().catch(() => {
            console.log('Dialog was already closed when accepted');
        });
    });
    await page.getByRole('button', { name: 'Send' }).click();
}

async function deleteUser(page, user: UsuarioModel) {
    await page.getByRole('link', { name: 'Users' }).click();
    await page.getByRole('link', { name: user.userId }).click();
    page.once('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.accept().catch(() => {
            console.log('Dialog was already closed when accepted');
        });
    });
    await page.getByRole('button', { name: 'Delete' }).click();
}

const user: UsuarioModel = {
    userId: '2019202359',
    userName: 'ryanmonteiro',
    userFullName: 'Ryan Tavares Farias da Silva Monteiro',
    userDesc: 'Ryan Tavares Farias da Silva Monteiro',
    userIp: '',
    userIcpcId: '',
    userSiteNumber: '1',
    userNumber: '2019202359',
    userType: 'Team',
    userEnabled: 'Yes',
    userMultiLogin: 'No',
    userPassword: 'boca',
    userChangePass: 'Yes',
    adminPassword: 'boca',
}

const admin: AdminModel = {
    username: 'admin',
    password: 'boca',
}

test('createUser', async ({ page }) => {
    await login(page, admin);
    await createUser(page, user);

    await expect(await page.locator(`text=${user.userName}`).first()).toBeTruthy();
})

test('insertUsers', async ({ page }) => {
    await login(page, admin);
    await insertUsers(page);

    await expect(await page.locator('text=ryanmonteiro').first()).toBeTruthy();
})

test('deleteUser', async ({ page }) => {
    await login(page, admin);
    await deleteUser(page, user);

    await expect(await page.locator(`text=${user.userName}(inactive)`).first()).toBeTruthy();
})
