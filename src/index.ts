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

import * as fs from 'fs';
import { chromium } from 'playwright';
import { type TCreateContest, type TUpdateContest } from './data/contest';
import { type Login } from './data/login';
import { type Setup, setupSchema } from './data/setup';
import { type Site } from './data/site';
import { type User } from './data/user';
import { createContest, updateContest } from './scripts/contest';
import { createProblem } from './scripts/problem';
import { createSite } from './scripts/site';
import { createUser, deleteUser, insertUsers, login } from './scripts/user';
import { retrieveFiles } from './scripts/report';
import { createLanguage, deleteLanguage } from './scripts/language';
import { type Language } from './data/language';
import { Logger } from './logger';
import { ReadErrors } from './errors/read_errors';
import { ZodError } from 'zod';
import { type Problem } from './data/problem';
import { Validate } from './data/validate';
import { exit } from 'process';

const STEP_DURATION = 200;
const HEADLESS = true;
export let BASE_URL = 'http://localhost:8000/boca';

//#region Users
async function shouldCreateUser(setup: Setup): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Creating users');

  // validate setup file with zod
  const setupValidated = new Validate(setup).createUser();
  const admin: Login = setupValidated.login;
  const user: User = setupValidated.user;

  const browser = await chromium.launch({
    headless: HEADLESS,
    slowMo: STEP_DURATION
  });
  const page = await browser.newPage();
  logger.logInfo('Logging in with admin user: %s', admin.username);
  await login(page, admin);
  logger.logInfo('Creating user: %s', user.userName);
  await createUser(page, user, admin);
  await browser.close();
}

async function shouldInsertUsers(setup: Setup): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Creating users');

  const setupValidated = new Validate(setup).insertUsers();
  const userPath = setupValidated.config.userPath;
  const admin: Login = setupValidated.login;

  const browser = await chromium.launch({
    headless: HEADLESS,
    slowMo: STEP_DURATION
  });
  const page = await browser.newPage();
  logger.logInfo('Logging in with admin user: %s', admin.username);
  await login(page, admin);
  logger.logInfo('Inserting users from file: %s', userPath);
  await insertUsers(page, userPath);
  await browser.close();
}

async function shouldDeleteUser(setup: Setup): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Deleting users');

  const setupValidated = new Validate(setup).deleteUser();
  const admin: Login = setupValidated.login;
  const userName: string = setupValidated.user.userName;

  const browser = await chromium.launch({
    headless: HEADLESS,
    slowMo: STEP_DURATION
  });
  const page = await browser.newPage();
  await login(page, admin);
  logger.logInfo('Deleting user: %s', userName);
  await deleteUser(page, userName, admin);
  await browser.close();
}
//#endregion

//#region Contests
async function shouldCreateContest(setup: Setup): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Creating contest');

  // validate setup file with zod
  const setupValidated = new Validate(setup).createContest();
  const system: Login = setupValidated.login;
  const contest: TCreateContest | undefined = setupValidated.contest;

  // create contest
  const browser = await chromium.launch({
    headless: HEADLESS,
    slowMo: STEP_DURATION
  });
  const page = await browser.newPage();
  logger.logInfo('Logging in with system user: %s', system.username);
  await login(page, system);
  logger.logInfo('Creating contest');
  const form = await createContest(page, contest);
  await browser.close();
  logger.logInfo('Contest created with id: %s', form.id);
  console.log(JSON.stringify(form));
}

async function shouldUpdateContest(setup: Setup): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Edit contest');

  // validate setup file with zod
  const setupValidated = new Validate(setup).updateContest();
  const system: Login = setupValidated.login;
  const contest: TUpdateContest = setupValidated.contest;

  // create contest
  const browser = await chromium.launch({
    headless: HEADLESS,
    slowMo: STEP_DURATION
  });
  const page = await browser.newPage();
  logger.logInfo('Logging in with system user: %s', system.username);
  await login(page, system);
  const form = await updateContest(page, contest);
  await browser.close();
  logger.logInfo('Contest updated with id: %s', form.id);
  console.log(JSON.stringify(form));
}
//#endregion

//#region Sites
async function shouldCreateSite(setup: Setup): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Creating site');

  // validate setup file with zod
  const setupValidated = new Validate(setup).createSite();
  const admin: Login = setupValidated.login;
  const site: Site = setupValidated.site;

  const browser = await chromium.launch({
    headless: HEADLESS,
    slowMo: STEP_DURATION
  });
  const page = await browser.newPage();
  await login(page, admin);
  await createSite(page, site);
  await browser.close();
}
//#endregion

//#region Problems
async function shouldCreateProblem(setup: Setup): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Creating problems');

  // validate setup file with zod
  const setupValidated = new Validate(setup).createProblems();
  const admin: Login = setupValidated.login;
  const problems: Problem[] = setupValidated.problems;

  for (const problem of problems) {
    const browser = await chromium.launch({
      headless: HEADLESS,
      slowMo: STEP_DURATION
    });
    const page = await browser.newPage();
    await login(page, admin);
    await createProblem(page, problem);
    await browser.close();
  }
}
//#endregion

//#region Languages
async function shouldCreateLanguage(setup: Setup): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Creating languages');

  // validate setup file with zod
  const setupValidated = new Validate(setup).createLanguages();
  const admin: Login = setupValidated.login;
  const languages: Language[] = setupValidated.languages;

  for (const language of languages) {
    const browser = await chromium.launch({
      headless: HEADLESS,
      slowMo: STEP_DURATION
    });
    const page = await browser.newPage();
    await login(page, admin);
    await createLanguage(page, language);
    await browser.close();
  }
}

async function shouldDeleteLanguage(setup: Setup): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Deleting languages');

  // validate setup file with zod
  const setupValidated = new Validate(setup).deleteLanguages();
  const admin: Login = setupValidated.login;
  const languages = setupValidated.languages;

  for (const language of languages) {
    const browser = await chromium.launch({
      headless: HEADLESS,
      slowMo: STEP_DURATION
    });
    const page = await browser.newPage();
    await login(page, admin);
    await deleteLanguage(page, language.name);
    await browser.close();
  }
}

//#endregion

//#region Reports
async function shouldGenerateReport(setup: Setup): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Generating reports');

  // validate setup file with zod
  const setupValidated = new Validate(setup).generateReport();
  const admin: Login = setupValidated.login;
  const outDir = setupValidated.config.outDir;

  const browser = await chromium.launch({
    headless: HEADLESS,
    slowMo: STEP_DURATION
  });
  const page = await browser.newPage();
  await login(page, admin);
  await retrieveFiles(page, outDir);
  await browser.close();
}

//#endregion

function main(): number {
  if (process.argv.length === 2) {
    console.error(
      'Missing command-line argument(s). ' +
        'To see the options available visit: ' +
        'https://github.com/rtmonteiro/boca-playwright\n'
    );
    process.exit(1);
  }

  const methods: Record<string, (setup: Setup) => Promise<void>> = {
    // Users
    shouldCreateUser,
    shouldInsertUsers,
    shouldDeleteUser,
    // Contests
    shouldCreateContest,
    shouldUpdateContest,
    // Sites
    shouldCreateSite,
    // Problems
    shouldCreateProblem,
    // Languages
    shouldCreateLanguage,
    shouldDeleteLanguage,
    // Reports
    shouldGenerateReport
  };

  const args = process.argv.splice(2);
  const path = args[0];
  const method = args[1];
  const logger = Logger.getInstance();

  try {
    fs.accessSync(path, fs.constants.R_OK);
  } catch (e) {
    logger.logError(ReadErrors.SETUP_NOT_FOUND);
    return 1;
  }
  const setup = JSON.parse(fs.readFileSync(path, 'utf8')) as Setup;
  try {
    setupSchema.parse(setup);
  } catch (e) {
    if (e instanceof ZodError) {
      logger.logZodError(e);
      exit(1);
    }
    return 1;
  } finally {
    logger.logInfo('Using setup file: %s', path);
  }
  BASE_URL = setup.config.url;

  const func = methods[method];
  func(setup)
    .then(() => {
      logger.logInfo('Done!');
    })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    .catch((e) => {
      logger.logError(e);
      exit(1);
    });

  return 0;
}

main();
