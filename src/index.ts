import {chromium} from "playwright";
import {LoginModel} from "./data/login.ts";
import {UserModel} from "./data/user.ts";
import {createUser, deleteUser, insertUsers, login} from "./scripts/usuarios.ts";
import {Contest, createContest, clearContest} from "./scripts/system.ts";
import * as fs from "fs";
import {SetupModel} from "./data/setup.ts";

const STEP_DURATION = 500;
const HEADLESS = false;

async function shouldCreateUser(path: string) {
    const admin: LoginModel = (JSON.parse(fs.readFileSync(path, 'utf8')) as SetupModel).logins.admin;
    const users: UserModel[] = (JSON.parse(fs.readFileSync(path, 'utf8')) as SetupModel).users;

    for (const user of users) {
        const browser = await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});  // Or 'firefox' or 'webkit'.
        const page = await browser.newPage();
        await login(page, admin);
        await createUser(page, user);

        await browser.close();
    }
}

async function shouldInsertUsers(path: string) {
    const userPath = (JSON.parse(fs.readFileSync(path, 'utf8')) as SetupModel).setup.userPath;
    const admin: LoginModel = (JSON.parse(fs.readFileSync(path, 'utf8')) as SetupModel).logins.admin;

    const browser = await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});  // Or 'firefox' or 'webkit'.
    const page = await browser.newPage();
    await login(page, admin);
    await insertUsers(page, userPath);
    await browser.close();
}

async function shouldDeleteUser(path: string) {
    const loginObj: LoginModel = (JSON.parse(fs.readFileSync(path, 'utf8')) as SetupModel).logins.admin;
    const user: UserModel = (JSON.parse(fs.readFileSync(path, 'utf8')) as SetupModel).users[0];

    const browser = await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});  // Or 'firefox' or 'webkit'.
    const page = await browser.newPage();
    await login(page, loginObj);
    await deleteUser(page, user);
    await browser.close();
}

async function shouldCreateContest(path: string) {
    const system: LoginModel = (JSON.parse(fs.readFileSync(path, 'utf8')) as SetupModel).logins.system;
    const contest: Contest = (JSON.parse(fs.readFileSync(path, 'utf8')) as SetupModel).contests[0];

    const browser = await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});  // Or 'firefox' or 'webkit'.
    const page = await browser.newPage();
    await login(page, system);
    await createContest(page, contest);
    await browser.close();
}

async function shouldClearContest(path: string) {
    const system: LoginModel = (JSON.parse(fs.readFileSync(path, 'utf8')) as SetupModel).logins.system;
    const contest: Contest = (JSON.parse(fs.readFileSync(path, 'utf8')) as SetupModel).contests[0];

    const browser = await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});  // Or 'firefox' or 'webkit'.
    const page = await browser.newPage();
    await login(page, system);
    await clearContest(page, contest);
    await browser.close();
}


function main() {
    const methods: Record<string, (path: string) => Promise<void>> = {
        // Users
        shouldCreateUser,
        shouldInsertUsers,
        shouldDeleteUser,
        // Contests
        shouldCreateContest,
        shouldClearContest
    }
    
    const args = process.argv.splice(2);
    const path = args[0];
    const method = args[1] as keyof typeof methods;

    const func = methods[method] as (path: string) => Promise<void>;
    func(path);
    return 0;
}

main()
