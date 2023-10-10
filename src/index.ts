import * as fs from "fs";
import {chromium} from "playwright";
import {Contest} from "./data/contest";
import {LoginModel} from "./data/login";
import {SetupModel} from "./data/setup";
import {SiteModel} from "./data/site";
import {UserModel} from "./data/user";
import {createContest, clearContest} from "./scripts/system";
import {createProblem, Problem} from "./scripts/problem";
import {createSite} from "./scripts/site";
import {createUser, deleteUser, insertUsers, login} from "./scripts/usuarios";
import { retrieveFiles } from "./scripts/report";

const STEP_DURATION = 200;
const HEADLESS = false;
export let BASE_URL = 'http://localhost:8000/boca';

// region Users
async function shouldCreateUser(setup: SetupModel) {
    const admin: LoginModel = setup.logins.admin;
    const users: UserModel[] = setup.users;
    const user: UserModel = users[0];

    // for (const user of users) {
        const browser = await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});  // Or 'firefox' or 'webkit'.
        const page = await browser.newPage();
        await login(page, admin);
        await createUser(page, user, admin);

        await browser.close();
    // }
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
    const admin: LoginModel = setup.logins.admin;

    const browser = await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});  // Or 'firefox' or 'webkit'.
    const page = await browser.newPage();
    await login(page, loginObj);
    await deleteUser(page, user, admin);
    await browser.close();
}
// endregion

// region Contests
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
// endregion

// region Sites
async function shouldCreateSite(setup: SetupModel) {
    const admin: LoginModel = setup.logins.admin;
    const site: SiteModel = setup.contests[0].sites[0];

    const browser = await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});  // Or 'firefox' or 'webkit'.
    const page = await browser.newPage();
    await login(page, admin);
    await createSite(page, site);
    await browser.close();
}
// endregion

// region Problems
async function shouldCreateProblem(setup: SetupModel) {
    const admin: LoginModel = setup.logins.admin;
    const problems: Problem[] = setup.contests[0].problems;

    for (const problem of problems) {
        const browser = await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});  // Or 'firefox' or 'webkit'.
        const page = await browser.newPage();
        await login(page, admin);
        await createProblem(page, problem);
        await browser.close();
    }
}
// endregion

// region Reports

async function shouldGenerateReport(setup: SetupModel) {
    const admin: LoginModel = setup.logins.admin;
    const outDir = setup.setup.outDir;

    const browser = await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});  // Or 'firefox' or 'webkit'.
    const page = await browser.newPage();
    await login(page, admin);
    await retrieveFiles(page, outDir);
    await browser.close();
}

// endregion

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
        shouldCreateProblem,
        // Reports
        shouldGenerateReport,
    }

    const args = process.argv.splice(2);
    const path = args[0];
    const method = args[1] as keyof typeof methods;

    const setup = (JSON.parse(fs.readFileSync(path, 'utf8')) as SetupModel);
    BASE_URL = setup.setup.url;

    const func = methods[method];
    func(setup).then(() => console.log('Done!'));
    return 0;
}

main()
