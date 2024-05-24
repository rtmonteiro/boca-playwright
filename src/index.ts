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

import { Option, program } from 'commander';
import * as fs from 'fs';
import { chromium } from 'playwright';
import { ZodError } from 'zod';
import { type TCreateContest, type TUpdateContest } from './data/contest';
import { type Login } from './data/login';
import { type Problem } from './data/problem';
import { setupSchema, type Setup } from './data/setup';
import { type Site } from './data/site';
import { type User } from './data/user';
import { Validate } from './data/validate';
import { ExitErrors, ReadErrors } from './errors/read_errors';
import { Logger } from './logger';
import { Output } from './output';
import { createContest, getContest, updateContest } from './scripts/contest';
import { createLanguage, deleteLanguage } from './scripts/language';
import { createProblem, deleteProblem, getProblem } from './scripts/problem';
import { retrieveFiles } from './scripts/report';
import { createSite } from './scripts/site';
import {
  createUser,
  deleteUser,
  getUser,
  insertUsers,
  login
} from './scripts/user';

const STEP_DURATION = 50;
const HEADLESS = true;
let TIMEOUT = 30000;
export let BASE_URL = 'http://localhost:8000/boca';

//#region User
async function shouldCreateUser(setup: Setup): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Creating users');

  // validate setup file with zod
  const validate = new Validate(setup);
  const setupValidated = validate.createUser();
  const admin: Login = setupValidated.login;
  const user: User = setupValidated.user;

  const browser = await chromium.launch({
    headless: HEADLESS,
    slowMo: STEP_DURATION
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(TIMEOUT);
  logger.logInfo('Logging in with admin user: %s', admin.username);
  await login(page, admin);
  await validate.checkLoginType(page, 'Admin');
  logger.logInfo('Creating user: %s', user.userName);
  await createUser(page, user, admin);
  const form = await getUser(page, user);
  await browser.close();
  logger.logInfo('User created with id: %s', form.userNumber);
  const output = Output.getInstance();
  output.setResult(form);
}

async function shouldInsertUsers(setup: Setup): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Creating users');

  // validate setup file with zod
  const validate = new Validate(setup);
  const setupValidated = validate.insertUsers();
  const userPath = setupValidated.config.userPath;
  const admin: Login = setupValidated.login;

  const browser = await chromium.launch({
    headless: HEADLESS,
    slowMo: STEP_DURATION
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(TIMEOUT);
  logger.logInfo('Logging in with admin user: %s', admin.username);
  await login(page, admin);
  await validate.checkLoginType(page, 'Admin');
  logger.logInfo('Inserting users from file: %s', userPath);
  await insertUsers(page, userPath);
  await browser.close();
}

async function shouldDeleteUser(setup: Setup): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Deleting users');

  // validate setup file with zod
  const validate = new Validate(setup);
  const setupValidated = validate.getUser();
  const admin: Login = setupValidated.login;
  const userId = setupValidated.user;

  const browser = await chromium.launch({
    headless: HEADLESS,
    slowMo: STEP_DURATION
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(TIMEOUT);
  await login(page, admin);
  await validate.checkLoginType(page, 'Admin');
  await deleteUser(page, userId, admin);
  await browser.close();
}

async function shouldGetUser(setup: Setup): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Getting user');

  // validate setup file with zod
  const validate = new Validate(setup);
  const setupValidated = validate.getUser();
  const admin: Login = setupValidated.login;
  const userId = setupValidated.user;

  const browser = await chromium.launch({
    headless: HEADLESS,
    slowMo: STEP_DURATION
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(TIMEOUT);
  await login(page, admin);
  await validate.checkLoginType(page, 'Admin');
  const form = await getUser(page, userId);
  await browser.close();
  logger.logInfo('User found with name: %s', form.userName);
  const output = Output.getInstance();
  output.setResult(form);
}
//#endregion

//#region Contest
async function shouldCreateContest(setup: Setup): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Creating contest');

  // validate setup file with zod
  const validate = new Validate(setup);
  const setupValidated = validate.createContest();
  const system: Login = setupValidated.login;
  const contest: TCreateContest | undefined = setupValidated.contest;

  // create contest
  const browser = await chromium.launch({
    headless: HEADLESS,
    slowMo: STEP_DURATION
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(TIMEOUT);
  logger.logInfo('Logging in with system user: %s', system.username);
  await login(page, system);
  await validate.checkLoginType(page, 'System');
  logger.logInfo('Creating contest');
  const form = await createContest(page, contest);
  await browser.close();
  logger.logInfo('Contest created with id: %s', form.id);
  const output = Output.getInstance();
  output.setResult(form);
}

async function shouldUpdateContest(setup: Setup): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Edit contest');

  // validate setup file with zod
  const validate = new Validate(setup);
  const setupValidated = validate.updateContest();
  const system: Login = setupValidated.login;
  const contest: TUpdateContest = setupValidated.contest;

  // create contest
  const browser = await chromium.launch({
    headless: HEADLESS,
    slowMo: STEP_DURATION
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(TIMEOUT);
  logger.logInfo('Logging in with system user: %s', system.username);
  await login(page, system);
  await validate.checkLoginType(page, 'System');
  const form = await updateContest(page, contest);
  await browser.close();
  logger.logInfo('Contest updated with id: %s', form.id);
  const output = Output.getInstance();
  output.setResult(form);
}

async function shouldGetContest(setup: Setup): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Getting contest');

  // validate setup file with zod
  const validate = new Validate(setup);
  const setupValidated = validate.getContest();
  const admin: Login = setupValidated.login;
  const contest = setupValidated.contest;

  const browser = await chromium.launch({
    headless: HEADLESS,
    slowMo: STEP_DURATION
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(TIMEOUT);
  logger.logInfo('Logging in with admin user: %s', admin.username);
  await login(page, admin);
  await validate.checkLoginType(page, 'System');
  const form = await getContest(page, contest.id);
  await browser.close();
  logger.logInfo('Contest found with name: %s', form.name);
  const output = Output.getInstance();
  output.setResult(form);
}
//#endregion

//#region Site
async function shouldCreateSite(setup: Setup): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Creating site');

  // validate setup file with zod
  const validate = new Validate(setup);
  const setupValidated = validate.createSite();
  const admin: Login = setupValidated.login;
  const site: Site = setupValidated.site;

  const browser = await chromium.launch({
    headless: HEADLESS,
    slowMo: STEP_DURATION
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(TIMEOUT);
  await login(page, admin);
  await validate.checkLoginType(page, 'Admin');
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
  const validate = new Validate(setup);
  const setupValidated = validate.createProblem();
  const admin: Login = setupValidated.login;
  const problem: Problem = setupValidated.problem;

  const browser = await chromium.launch({
    headless: HEADLESS,
    slowMo: STEP_DURATION
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(TIMEOUT);
  await login(page, admin);
  await validate.checkLoginType(page, 'Admin');
  const form = await createProblem(page, problem);
  await browser.close();
  logger.logInfo('Problem created with id: %s', form.id);
  const output = Output.getInstance();
  output.setResult(form);
}

async function shouldDeleteProblem(setup: Setup): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Deleting problem');

  // validate setup file with zod
  const validate = new Validate(setup);
  const setupValidated = validate.getProblem();
  const admin: Login = setupValidated.login;
  const problem = setupValidated.problem;

  const browser = await chromium.launch({
    headless: HEADLESS,
    slowMo: STEP_DURATION
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(TIMEOUT);
  await login(page, admin);
  await validate.checkLoginType(page, 'Admin');
  const form = await deleteProblem(page, problem);
  await browser.close();
  logger.logInfo('Problem deleted with id: %s', form.id);
  const output = Output.getInstance();
  output.setResult(form);
}

async function shouldGetProblem(setup: Setup): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Getting problem');

  // validate setup file with zod
  const validate = new Validate(setup);
  const setupValidated = validate.getProblem();
  const admin: Login = setupValidated.login;
  const problem = setupValidated.problem;

  const browser = await chromium.launch({
    headless: HEADLESS,
    slowMo: STEP_DURATION
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(TIMEOUT);
  await login(page, admin);
  await validate.checkLoginType(page, 'Admin');
  const form = await getProblem(page, problem);
  await browser.close();
  logger.logInfo('Problem found with name: %s', form.name);
  const output = Output.getInstance();
  output.setResult(form);
}
//#endregion

//#region Languages
async function shouldCreateLanguage(setup: Setup): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Creating language');

  // validate setup file with zod
  const validate = new Validate(setup);
  const setupValidated = validate.createLanguage();
  const admin: Login = setupValidated.login;
  const language = setupValidated.language;

  const browser = await chromium.launch({
    headless: HEADLESS,
    slowMo: STEP_DURATION
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(TIMEOUT);
  await login(page, admin);
  await validate.checkLoginType(page, 'Admin');
  const form = await createLanguage(page, language);
  await browser.close();
  logger.logInfo('Language created with id: %s', form.id);
  const output = Output.getInstance();
  output.setResult(form);
}

async function shouldDeleteLanguage(setup: Setup): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Deleting language');

  // validate setup file with zod
  const validate = new Validate(setup);
  const setupValidated = validate.deleteLanguage();
  const admin: Login = setupValidated.login;
  const language = setupValidated.language;

  const browser = await chromium.launch({
    headless: HEADLESS,
    slowMo: STEP_DURATION
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(TIMEOUT);
  await login(page, admin);
  await validate.checkLoginType(page, 'Admin');
  await deleteLanguage(page, language);
  await browser.close();
}

//#endregion

//#region Reports
async function shouldGenerateReport(setup: Setup): Promise<void> {
  // instantiate logger
  const logger = Logger.getInstance();
  logger.logInfo('Generating reports');

  // validate setup file with zod
  const validate = new Validate(setup);
  const setupValidated = validate.generateReport();
  const admin: Login = setupValidated.login;
  const outDir = setupValidated.config.outReportDir;

  const browser = await chromium.launch({
    headless: HEADLESS,
    slowMo: STEP_DURATION
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(TIMEOUT);
  await login(page, admin);
  await validate.checkLoginType(page, 'Admin');
  await retrieveFiles(page, outDir);
  await browser.close();
}

//#endregion

const methods: Record<string, (setup: Setup) => Promise<void>> = {
  // Users
  createUser: shouldCreateUser,
  insertUsers: shouldInsertUsers,
  deleteUser: shouldDeleteUser,
  getUser: shouldGetUser,
  // Contests
  createContest: shouldCreateContest,
  updateContest: shouldUpdateContest,
  getContest: shouldGetContest,
  // Sites
  createSite: shouldCreateSite,
  // Problems
  createProblem: shouldCreateProblem,
  deleteProblem: shouldDeleteProblem,
  getProblem: shouldGetProblem,
  // Languages
  createLanguage: shouldCreateLanguage,
  deleteLanguage: shouldDeleteLanguage,
  // Reports
  generateReport: shouldGenerateReport
};

function main(): number {
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
    .option('-t, --timeout <timeout>', 'timeout for playwright', '30000')
    .option('-v, --verbose', 'verbose mode')
    .parse();

  const { path, method, verbose, timeout } = program.opts();
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
    if (e instanceof ZodError) logger.logZodError(e);
    process.exit(ExitErrors.CONFIG_VALIDATION);
  } finally {
    logger.logInfo('Using setup file: %s', path);
  }
  BASE_URL = setup.config.url;
  TIMEOUT = parseInt(timeout);

  if (setup.config.resultFilePath) {
    output.isActive = true;
  }

  const func = methods[method];
  func(setup)
    .then(() => {
      logger.logInfo('Done!');
      if (output.isActive) {
        logger.logInfo('Output file: %s', setup.config.resultFilePath!);
        output.writeFile(setup.config.resultFilePath!);
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
