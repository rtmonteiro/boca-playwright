import {chromium} from "playwright";
import {LoginModel} from "./data/login.ts";
import {UserModel} from "./data/user.ts";
import {createUser, deleteUser, insertUsers, login} from "./scripts/usuarios.ts";
import {createContest, clearContest} from "./scripts/system.ts";
import * as fs from "fs";
import {SetupModel} from "./data/setup.ts";
import {SiteModel} from "./data/site.ts";
import {createSite} from "./scripts/site.ts";
import {Contest} from "./scripts/contest.ts";
import {createProblem} from "./scripts/problem.ts";

const STEP_DURATION = 200;
const HEADLESS = false;
export const BASE_URL = 'http://localhost:8000/boca';

async function shouldCreateUser(setup: SetupModel) {
    const admin: LoginModel = setup.logins.admin;
    const users: UserModel[] = setup.users;

    for (const user of users) {
        const browser = await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});  // Or 'firefox' or 'webkit'.
        const page = await browser.newPage();
        await login(page, admin);
        await createUser(page, user);

        await browser.close();
    }
}

async function shouldInsertUsers(setup: SetupModel) {
    const userPath = setup.setup.userPath;
    const admin: LoginModel = setup.logins.admin;

    const browser = await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});  // Or 'firefox' or 'webkit'.
    const page = await browser.newPage();
    await login(page, admin);
    await insertUsers(page, userPath);
    await browser.close();
}

async function shouldDeleteUser(setup: SetupModel) {
    const loginObj: LoginModel = setup.logins.admin;
    const user: UserModel = setup.users[0];

    const browser = await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});  // Or 'firefox' or 'webkit'.
    const page = await browser.newPage();
    await login(page, loginObj);
    await deleteUser(page, user);
    await browser.close();
}

async function shouldCreateContest(setup: SetupModel) {
    const system: LoginModel = setup.logins.system;
    const contest: Contest = setup.contests[0];

    const browser = await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});  // Or 'firefox' or 'webkit'.
    const page = await browser.newPage();
    await login(page, system);
    await createContest(page, contest);
    await browser.close();
}

async function shouldClearContest(setup: SetupModel) {
    const system: LoginModel = setup.logins.system;
    const contest: Contest = setup.contests[0];

    const browser = await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});  // Or 'firefox' or 'webkit'.
    const page = await browser.newPage();
    await login(page, system);
    await clearContest(page, contest);
    await browser.close();
}

async function shouldCreateSite(setup: SetupModel) {
    const admin: LoginModel = setup.logins.admin;
    const site: SiteModel = setup.contests[0].sites[0];

    const browser = await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});  // Or 'firefox' or 'webkit'.
    const page = await browser.newPage();
    await login(page, admin);
    await createSite(page, site);
    await browser.close();
}

async function shouldCreateProblem(setup: SetupModel) {
    const admin: LoginModel = setup.logins.admin;

    for (const problem of setup.contests[0].problems) {
        const browser = await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});  // Or 'firefox' or 'webkit'.
        const page = await browser.newPage();
        await login(page, admin);
        await createProblem(page, problem);
        await browser.close();
    }
}


function main() {
    const methods: Record<string, (setup: SetupModel) => Promise<void>> = {
        // Users
        shouldCreateUser,
        shouldInsertUsers,
        shouldDeleteUser,
        // Contests
        shouldCreateContest,
        shouldClearContest,
        // Sites
        shouldCreateSite,
        // Problems
        shouldCreateProblem
    }

    const args = process.argv.splice(2);
    const path = args[0];
    const method = args[1] as keyof typeof methods;

    const setup = (JSON.parse(fs.readFileSync(path, 'utf8')) as SetupModel);

    const func = methods[method] as (setup: SetupModel) => Promise<void>;
    func(setup).then(() => console.log('Done!'));
    return 0;
}

main()
