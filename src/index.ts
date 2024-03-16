// ========================================================================
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

import * as fs from "fs";
import { chromium } from "playwright";
import { ContestModel } from "./data/contest";
import { LoginModel } from "./data/login";
import { SetupModel, setupModelSchema } from "./data/setup";
import { SiteModel } from "./data/site";
import { UserModel } from "./data/user";
import { createContest, clearContest } from "./scripts/contest";
import { createProblem } from "./scripts/problem";
import { createSite } from "./scripts/site";
import { createUser, deleteUser, insertUsers, login } from "./scripts/user";
import { retrieveFiles } from "./scripts/report";
import { createLanguage, deleteLanguage } from "./scripts/language";
import { Language } from "./data/language";
import { Logger } from "./logger";
import { ReadErrors } from "./errors/read_errors";
import { ZodError } from "zod";
import { Problem } from "./data/problem";
import { Validate } from "./data/validate";

const STEP_DURATION = 200;
const HEADLESS = true;
export let BASE_URL = 'http://localhost:8000/boca';

if (process.argv.length === 2) {
  console.error('Missing command-line argument(s). ' +
    'To see the options available visit: ' + 
    'https://github.com/rtmonteiro/boca-playwright\n');
  process.exit(1);
}

// region Users
async function shouldCreateUser(setup: SetupModel) {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Creating users');

  // validate setup file with zod
  const validate = new Validate(setup);
  validate.loginAdmin();
  const admin: LoginModel = setup.logins.admin;
  validate.createUser();
  const user: UserModel = setup.user;

  const browser = 
    await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});
  const page = await browser.newPage();
  logger.logInfo('Logging in with admin user: %s', admin.username);
  await login(page, admin);
  logger.logInfo('Creating user: %s', user.userName);
  await createUser(page, user, admin);
  await browser.close();
}

async function  shouldInsertUsers(setup: SetupModel) {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Creating users');

  const validate = new Validate(setup);
  validate.loginAdmin();
  const userPath = setup.setup.userPath;
  validate.insertUsers();
  const admin: LoginModel = setup.logins.admin;

  const browser = 
    await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});
  const page = await browser.newPage();
  logger.logInfo('Logging in with admin user: %s', admin.username);
  await login(page, admin);
  logger.logInfo('Inserting users from file: %s', userPath);
  await insertUsers(page, userPath);
  await browser.close();
}

async function shouldDeleteUser(setup: SetupModel) {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Deleting users');

  const validate = new Validate(setup);
  validate.loginAdmin();
  const admin: LoginModel = setup.logins.admin;
  validate.deleteUser();
  const user: UserModel = setup.user;

  const browser = 
    await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});
  const page = await browser.newPage();
  await login(page, admin);
  logger.logInfo('Deleting user: %s', user.userName);
  await deleteUser(page, user, admin);
  await browser.close();
}
// endregion

// region Contests
async function shouldCreateContest(setup: SetupModel) {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Creating contest');

  // validate setup file with zod
  const validate = new Validate(setup);
  validate.loginSystem();
  const system: LoginModel = setup.logins.system;
  validate.createContest();
  const contest: ContestModel = setup.contests[0];

  // create contest
  const browser = 
    await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});
  const page = await browser.newPage();
  logger.logInfo('Logging in with system user: %s', system.username);
  await login(page, system);
  logger.logInfo('Creating contest: %s', contest.setup.name);
  await createContest(page, contest);
  await browser.close();
}

async function shouldUpdateContest(setup: SetupModel) {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Edit contest');

  // validate setup file with zod
  const validate = new Validate(setup);
  validate.loginSystem();
  const system: LoginModel = setup.logins.system;
  validate.updateContest();
  const contest: ContestModel = setup.contests[0];

  // create contest
  const browser = 
    await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});
  const page = await browser.newPage();
  logger.logInfo('Logging in with system user: %s', system.username);
  await login(page, system);
  logger.logInfo('Editing contest: %s', contest.setup.name);
  await createContest(page, contest);
  await browser.close();
}

async function shouldClearContest(setup: SetupModel) {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Clear contest');

  // validate setup file with zod
  const validate = new Validate(setup);
  validate.loginSystem();
  const system: LoginModel = setup.logins.system;
  validate.clearContest();
  const contest: ContestModel = setup.contests[0];

  const browser = 
    await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});
  const page = await browser.newPage();
  logger.logInfo('Logging in with system user: %s', system.username);
  await login(page, system);
  logger.logInfo('Clearing contest id: %s', contest.setup.id);
  await clearContest(page, contest);
  await browser.close();
}
// endregion

// region Sites
async function shouldCreateSite(setup: SetupModel) {
  const admin: LoginModel = setup.logins.admin;
  const site: SiteModel = setup.contests[0].sites[0];

  const browser = 
    await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});
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
    const browser = 
      await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});
    const page = await browser.newPage();
    await login(page, admin);
    await createProblem(page, problem);
    await browser.close();
  }
}
// endregion

// region Languages

async function shouldCreateLanguage(setup: SetupModel) {
  const admin: LoginModel = setup.logins.admin;
  const languages: Language[] = setup.contests[0].languages;

  for (const language of languages) {
    const browser = 
      await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});
    const page = await browser.newPage();
    await login(page, admin);
    await createLanguage(page, language);
    await browser.close();
  }
}

async function shouldDeleteLanguage(setup: SetupModel) {
  const admin: LoginModel = setup.logins.admin;
  const languages: Language[] = setup.contests[0].languages;

  for (const language of languages) {
    const browser = 
      await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});
    const page = await browser.newPage();
    await login(page, admin);
    await deleteLanguage(page, language);
    await browser.close();
  }
}

// endregion

// region Reports

async function shouldGenerateReport(setup: SetupModel) {
  const admin: LoginModel = setup.logins.admin;
  const outDir = setup.setup.outDir;

  const browser = 
    await chromium.launch({headless: HEADLESS, slowMo: STEP_DURATION});
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
    shouldUpdateContest,
    shouldClearContest,
    // Sites
    shouldCreateSite,
    // Problems
    shouldCreateProblem,
    // Languages
    shouldCreateLanguage,
    shouldDeleteLanguage,
    // Reports
    shouldGenerateReport,
  }

  const args = process.argv.splice(2);
  const path = args[0];
  const method = args[1] as keyof typeof methods;
  const logger = Logger.getInstance();

  try {
    fs.accessSync(path, fs.constants.R_OK);
  } catch (e) {
    logger.logError(ReadErrors.SETUP_NOT_FOUND);
    return 1;
  }
  const setup = (JSON.parse(fs.readFileSync(path, 'utf8')) as SetupModel);
  try {
    setupModelSchema.parse(setup);
  } catch (e) {
    if (e instanceof ZodError) {
        logger.logZodError(e)
    }
    return 1;
  } finally {
    logger.logInfo('Using setup file: %s', path);
  }
  BASE_URL = setup.setup.url;

  const func = methods[method];
  func(setup)
    .catch((e) => logger.logError(e))
    .then(() => logger.logInfo('Done!'));
  return 0;
}

main()
