import {chromium} from "playwright";
import {admin} from "./data/login.ts";
import {user} from "./data/user.ts";
import {createUser, deleteUser, insertUsers, login} from "./scripts/usuarios.ts";

async function shouldCreateUser() {
    const browser = await chromium.launch({headless: false, slowMo: 100});  // Or 'firefox' or 'webkit'.
    const page = await browser.newPage();
    await login(page, admin);
    await createUser(page, user);

    await browser.close();
}

async function shouldInsertUsers() {
    const browser = await chromium.launch({headless: false, slowMo: 100});  // Or 'firefox' or 'webkit'.
    const page = await browser.newPage();
    await login(page, admin);
    await insertUsers(page);
    await browser.close();
}

async function shouldDeleteUser() {
    const browser = await chromium.launch({headless: false, slowMo: 100});  // Or 'firefox' or 'webkit'.
    const page = await browser.newPage();
    await login(page, admin);
    await deleteUser(page, user);
    await browser.close();
}

(async () => {
    await shouldCreateUser();
    await shouldInsertUsers();
    await shouldDeleteUser();
})()
