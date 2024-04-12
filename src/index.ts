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
import { type ContestModel } from './data/contest';
import { type LoginModel } from './data/login';
import { type SetupModel, setupModelSchema } from './data/setup';
import { type SiteModel } from './data/site';
import { type UserModel } from './data/user';
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

const STEP_DURATION = 200;
const HEADLESS = true;
export let BASE_URL = 'http://localhost:8000/boca';

// region Users
async function shouldCreateUser(setup: SetupModel): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Creating users');

  // validate setup file with zod
  const setupValidated = new Validate(setup).createUser();
  const admin: LoginModel = setupValidated.login;
  const user: UserModel = setupValidated.user;

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

async function shouldInsertUsers(setup: SetupModel): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Creating users');

  const setupValidated = new Validate(setup).insertUsers();
  const userPath = setupValidated.config.userPath;
  const admin: LoginModel = setupValidated.login;

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

async function shouldDeleteUser(setup: SetupModel): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Deleting users');

  const setupValidated = new Validate(setup).deleteUser();
  const admin: LoginModel = setupValidated.login;
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
// endregion

// region Contests
async function shouldCreateContest(setup: SetupModel): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Creating contest');

  // validate setup file with zod
  const setupValidated = new Validate(setup).createContest();
  const system: LoginModel = setupValidated.login;
  const contest: ContestModel = setupValidated.contest;

  // create contest
  const browser = await chromium.launch({
    headless: HEADLESS,
    slowMo: STEP_DURATION
  });
  const page = await browser.newPage();
  logger.logInfo('Logging in with system user: %s', system.username);
  await login(page, system);
  logger.logInfo('Creating contest: %s', contest.config.name);
  await createContest(page, contest);
  await browser.close();
}

async function shouldUpdateContest(setup: SetupModel): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Edit contest');

  // validate setup file with zod
  const setupValidated = new Validate(setup).updateContest();
  const system: LoginModel = setupValidated.login;
  const contest: ContestModel = setupValidated.contest;

  // create contest
  const browser = await chromium.launch({
    headless: HEADLESS,
    slowMo: STEP_DURATION
  });
  const page = await browser.newPage();
  logger.logInfo('Logging in with system user: %s', system.username);
  await login(page, system);
  logger.logInfo('Editing contest: %s', contest.config.name);
  await updateContest(page, contest);
  await browser.close();
}
// endregion

// region Sites
async function shouldCreateSite(setup: SetupModel): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Creating site');

  // validate setup file with zod
  const setupValidated = new Validate(setup).createSite();
  const admin: LoginModel = setupValidated.login;
  const site: SiteModel = setupValidated.site;

  const browser = await chromium.launch({
    headless: HEADLESS,
    slowMo: STEP_DURATION
  });
  const page = await browser.newPage();
  await login(page, admin);
  await createSite(page, site);
  await browser.close();
}
// endregion

// region Problems
async function shouldCreateProblem(setup: SetupModel): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Creating problems');

  // validate setup file with zod
  const setupValidated = new Validate(setup).createProblem();
  const admin: LoginModel = setupValidated.login;
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
// endregion

// region Languages

async function shouldCreateLanguage(setup: SetupModel): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Creating languages');

  // validate setup file with zod
  const setupValidated = new Validate(setup).createLanguages();
  const admin: LoginModel = setupValidated.login;
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

async function shouldDeleteLanguage(setup: SetupModel): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Deleting languages');

  // validate setup file with zod
  const setupValidated = new Validate(setup).deleteLanguages();
  const admin: LoginModel = setupValidated.login;
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

// endregion

// region Reports

async function shouldGenerateReport(setup: SetupModel): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Generating reports');

  // validate setup file with zod
  const setupValidated = new Validate(setup).generateReport();
  const admin: LoginModel = setupValidated.login;
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

// endregion

function main(): number {
  if (process.argv.length === 2) {
    console.error(
      'Missing command-line argument(s). ' +
        'To see the options available visit: ' +
        'https://github.com/rtmonteiro/boca-playwright\n'
    );
    process.exit(1);
  }

  const methods: Record<string, (setup: SetupModel) => Promise<void>> = {
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
  const setup = JSON.parse(fs.readFileSync(path, 'utf8')) as SetupModel;
  try {
    setupModelSchema.parse(setup);
  } catch (e) {
    if (e instanceof ZodError) {
      logger.logZodError(e);
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
      return 1;
    });

  return 0;
}

main();
