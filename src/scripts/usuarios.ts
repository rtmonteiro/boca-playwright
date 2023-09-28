import {Dialog, Page} from "playwright";
import {LoginModel} from "../data/login.ts";
import {UsuarioModel} from "../data/user.ts";

const BASE_URL = "localhost:8000/boca"

export async function login(page: Page, login: LoginModel) {
    await page.goto(BASE_URL+'/');
    await page.locator('input[name="name"]').click();
    await page.locator('input[name="name"]').fill(login.username);
    await page.locator('input[name="name"]').press('Tab');
    await page.locator('input[name="password"]').fill(login.password);
    await page.locator('input[name="password"]').press('Enter');
}

export async function insertUsers(page: Page, path: string) {
    await page.getByRole('link', { name: 'Users' }).click();
    await page.locator('input[name="importfile"]').click();
    await page.locator('input[name="importfile"]').setInputFiles(path);
    page.once('dialog', (dialog: Dialog) => {
        dialog.accept().catch(() => {
            console.error('Dialog was already closed when accepted');
        });
    });
    await page.getByRole('button', { name: 'Import' }).click();
}

async function fillUser(page: Page, user: UsuarioModel) {
    await page.goto(BASE_URL+'/admin/');
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
    if (user.userPassword) {
        await page.locator('input[name="passwordn1"]').click();
        await page.locator('input[name="passwordn1"]').fill(user.userPassword);
        await page.locator('input[name="passwordn2"]').click();
        await page.locator('input[name="passwordn2"]').fill(user.userPassword);
        await page.locator('select[name="changepass"]').click();
        await page.locator('select[name="changepass"]').selectOption({ label: user.userChangePass });
    }
    await page.locator('input[name="passwordo"]').click();
    await page.locator('input[name="passwordo"]').fill(user.adminPassword);
}

export async function createUser(page: Page, user: UsuarioModel) {
    await fillUser(page, user);
    page.once('dialog', (dialog: Dialog) => {
        dialog.accept().catch(() => {
            console.error('Dialog was already closed when accepted');
        });
    });
    await page.getByRole('button', { name: 'Send' }).click();
}

export async function deleteUser(page: Page, user: UsuarioModel) {
    await page.getByRole('link', { name: 'Users' }).click();
    await page.getByRole('link', { name: user.userId }).click();
    page.once('dialog', (dialog: Dialog) => {
        dialog.accept().catch(() => {
            console.error('Dialog was already closed when accepted');
        });
    });
    await page.getByRole('button', { name: 'Delete' }).click();
}
