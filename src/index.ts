import {chromium} from "playwright";
import {admin, LoginModel} from "./data/login.ts";
import {UsuarioModel} from "./data/user.ts";
import {createUser, deleteUser, insertUsers, login} from "./scripts/usuarios.ts";
import {Contest, createContest} from "./scripts/system.ts";
import * as fs from "fs";
import {SetupModel} from "./data/setup.ts";

const STEP_DURATION = 0;
const HEADLESS = false;

async function shouldCreateUser(path: string) {
    const loginObj: LoginModel = (JSON.parse(fs.readFileSync(path, 'utf8')) as SetupModel).logins[1];
    const users: UsuarioModel[] = (JSON.parse(fs.readFileSync(path, 'utf8')) as SetupModel).users;
    for (const user of users) {
        const browser = await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});  // Or 'firefox' or 'webkit'.
        const page = await browser.newPage();
        await login(page, loginObj);
        await createUser(page, user);

        await browser.close();
    }
}

async function shouldInsertUsers(userPath: string) {
    const browser = await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});  // Or 'firefox' or 'webkit'.
    const page = await browser.newPage();
    await login(page, admin);
    await insertUsers(page, userPath);
    await browser.close();
}

async function shouldDeleteUser(loginObj: LoginModel, user: UsuarioModel) {
    const browser = await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});  // Or 'firefox' or 'webkit'.
    const page = await browser.newPage();
    await login(page, loginObj);
    await deleteUser(page, user);
    await browser.close();
}

async function shouldCreateContest(system: LoginModel, contest: Contest) {
    const browser = await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});  // Or 'firefox' or 'webkit'.
    const page = await browser.newPage();
    await login(page, system);
    await createContest(page, contest);
    await browser.close();
}

const methods: any = {
    // Users
    shouldCreateUser,
    shouldInsertUsers,
    shouldDeleteUser,
    // Contests
    shouldCreateContest,
}


function main() {
    const args = process.argv.splice(2);
    const path = args[0];
    const method = args[1];
    methods[method](path);
    return 0;
}

main()
