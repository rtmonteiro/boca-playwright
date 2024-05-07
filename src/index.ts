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
import { Option, program } from 'commander';
import { ZodError } from 'zod';
import { Output } from './output';
import { Logger } from './logger';
import { type TCreateContest, type TUpdateContest } from './data/contest';
import { type Login } from './data/login';
import { type Setup, setupSchema } from './data/setup';
import { type Site } from './data/site';
import { type User } from './data/user';
import { type Language } from './data/language';
import { type Problem } from './data/problem';
import { Validate } from './data/validate';
import { createContest, updateContest } from './scripts/contest';
import { createProblem } from './scripts/problem';
import { createSite } from './scripts/site';
import { createUser, deleteUser, insertUsers, login } from './scripts/user';
import { retrieveFiles } from './scripts/report';
import { createLanguage, deleteLanguage } from './scripts/language';
import { ExitErrors, ReadErrors } from './errors/read_errors';

const STEP_DURATION = 50;
const HEADLESS = true;
export let BASE_URL = 'http://localhost:8000/boca';

//#region User
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

//#region Contest
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

//#region Site
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

//#region Problem
async function shouldCreateProblem(setup: Setup): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Creating problem');

  // validate setup file with zod
  const setupValidated = new Validate(setup).createProblem();
  const admin: Login = setupValidated.login;
  const problem: Problem = setupValidated.problem;

  const browser = await chromium.launch({
    headless: HEADLESS,
    slowMo: STEP_DURATION
  });
  const page = await browser.newPage();
  await login(page, admin);
  await createProblem(page, problem);
  await browser.close();
}
//#endregion

//#region Languages
async function shouldCreateLanguage(setup: Setup): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Creating language');

  // validate setup file with zod
  const setupValidated = new Validate(setup).createLanguage();
  const admin: Login = setupValidated.login;
  const language: Language = setupValidated.language;

  const browser = await chromium.launch({
    headless: HEADLESS,
    slowMo: STEP_DURATION
  });
  const page = await browser.newPage();
  await login(page, admin);
  await createLanguage(page, language);
  await browser.close();
}

async function shouldDeleteLanguage(setup: Setup): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Deleting language');

  // validate setup file with zod
  const setupValidated = new Validate(setup).deleteLanguage();
  const admin: Login = setupValidated.login;
  const language = setupValidated.language;

  const browser = await chromium.launch({
    headless: HEADLESS,
    slowMo: STEP_DURATION
  });
  const page = await browser.newPage();
  await login(page, admin);
  await deleteLanguage(page, language.name);
  await browser.close();
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
  const outDir = setupValidated.config.outReportDir;

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
  const methods: Record<string, (setup: Setup) => Promise<void>> = {
    // Users
    createUser: shouldCreateUser,
    insertUsers: shouldInsertUsers,
    deleteUser: shouldDeleteUser,
    // Contests
    createContest: shouldCreateContest,
    updateContest: shouldUpdateContest,
    // Sites
    createSite: shouldCreateSite,
    // Problems
    createProblem: shouldCreateProblem,
    // Languages
    createLanguage: shouldCreateLanguage,
    deleteLanguage: shouldDeleteLanguage,
    // Reports
    generateReport: shouldGenerateReport
  };

  program
    .name('boca-cli')
    .description('CLI for Boca')
    .version('0.1.0')
    .requiredOption('-p, --path <path>', 'path to setup file')
    .addOption(
      new Option('-m, --method <method>', 'method to execute')
        .choices(Object.keys(methods))
        .makeOptionMandatory()
    )
    .option('-v, --verbose', 'verbose mode')
    .option('-l, --log', 'log output to file')
    .parse();

  const { path, method, verbose, log } = program.opts();
  if (!path || !method) {
    console.error(
      'Missing command-line argument(s). ' +
        'To see the options available visit: ' +
        'https://github.com/rtmonteiro/boca-playwright\n'
    );
    process.exit(ExitErrors.NOT_ENOUGH_ARGUMENTS);
  }
  const logger = Logger.getInstance(verbose);
  const output = Output.getInstance();

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
      process.exit(ExitErrors.CONFIG_VALIDATION);
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
      if (log && setup.config.outFilePath) {
        logger.logInfo('Output file: %s', setup.config.outFilePath);
        output.writeFile(setup.config.outFilePath);
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    .catch((e) => {
      logger.logError(e);
      process.exit(ExitErrors.CONFIG_VALIDATION);
    });

  return ExitErrors.OK;
}

main();
