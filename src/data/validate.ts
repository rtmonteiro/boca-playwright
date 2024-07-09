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

import { type Page } from 'playwright';
import { z } from 'zod';
import { authSchema } from './auth';
import {
  createContestSchema,
  getContestSchema,
  updateContestSchema
} from './contest';
import { answerSchema, getAnswerSchema } from './answer';
import { languageSchema, getLanguageSchema } from './language';
import {
  createProblemSchema,
  downloadProblemSchema,
  getProblemSchema,
  updateProblemSchema
} from './problem';
import { getRunSchema, runSchema } from './run';
import { type Setup } from './setup';
import { getSiteSchema, siteSchema } from './site';
import {
  type User,
  getUserSchema,
  importUsersSchema,
  userSchema
} from './user';
import { AuthError, AuthMessages } from '../errors/read_errors';

export class Validate {
  constructor(public setup: Setup) {}

  checkAuthentication(): z.infer<typeof setupType> {
    const setupType = z.object({
      login: authSchema
    });
    setupType.parse(this.setup);
    return this.setup as z.infer<typeof setupType>;
  }

  async checkUserType(
    page: Page,
    type: User['type'] | 'System'
  ): Promise<void> {
    // Wait for load state
    await page.waitForLoadState('domcontentloaded');

    // Get url from page
    const url = await page.url();
    // Get the type from the url
    const typeUrl = url.split('/').at(-2) as unknown as User['type'];
    // Compare the types
    if (type && type.toLocaleLowerCase() !== typeUrl) {
      throw new AuthError(
        AuthMessages.INVALID_TYPE,
        `Expected type ${type} but got ${typeUrl}`
      );
    }
  }

  createContest(): z.infer<typeof setupType> {
    const setupType = z.object({
      login: authSchema,
      contest: createContestSchema.optional()
    });
    setupType.parse(this.setup);
    return this.setup as z.infer<typeof setupType>;
  }

  getContest(): z.infer<typeof setupType> {
    const setupType = z.object({
      login: authSchema,
      contest: getContestSchema
    });
    setupType.parse(this.setup);
    return this.setup as z.infer<typeof setupType>;
  }

  updateContest(): z.infer<typeof setupType> {
    const setupType = z.object({
      login: authSchema,
      contest: updateContestSchema
    });
    setupType.parse(this.setup);
    return this.setup as z.infer<typeof setupType>;
  }

  createAnswer(): z.infer<typeof setupType> {
    const setupType = z.object({
      login: authSchema,
      answer: answerSchema
    });
    setupType.parse(this.setup);
    return this.setup as z.infer<typeof setupType>;
  }

  getAnswer(): z.infer<typeof setupType> {
    const setupType = z.object({
      login: authSchema,
      answer: getAnswerSchema
    });
    setupType.parse(this.setup);
    return this.setup as z.infer<typeof setupType>;
  }

  createLanguage(): z.infer<typeof setupType> {
    const setupType = z.object({
      login: authSchema,
      language: languageSchema
    });
    setupType.parse(this.setup);
    return this.setup as z.infer<typeof setupType>;
  }

  getLanguage(): z.infer<typeof setupType> {
    const setupType = z.object({
      login: authSchema,
      language: getLanguageSchema
    });
    setupType.parse(this.setup);
    return this.setup as z.infer<typeof setupType>;
  }

  createProblem(): z.infer<typeof setupType> {
    const setupType = z.object({
      login: authSchema,
      problem: createProblemSchema
    });
    setupType.parse(this.setup);
    return this.setup as z.infer<typeof setupType>;
  }

  downloadProblem(): z.infer<typeof setupType> {
    const setupType = z.object({
      login: authSchema,
      problem: downloadProblemSchema
    });
    setupType.parse(this.setup);
    return this.setup as z.infer<typeof setupType>;
  }

  getProblem(): z.infer<typeof setupType> {
    const setupType = z.object({
      login: authSchema,
      problem: getProblemSchema
    });
    setupType.parse(this.setup);
    return this.setup as z.infer<typeof setupType>;
  }

  updateProblem(): z.infer<typeof setupType> {
    const setupType = z.object({
      login: authSchema,
      problem: updateProblemSchema
    });
    setupType.parse(this.setup);
    return this.setup as z.infer<typeof setupType>;
  }

  createSite(): z.infer<typeof setupType> {
    const setupType = z.object({
      login: authSchema,
      site: siteSchema
    });
    setupType.parse(this.setup);
    return this.setup as z.infer<typeof setupType>;
  }

  getSite(): z.infer<typeof setupType> {
    const setupType = z.object({
      login: authSchema,
      site: getSiteSchema
    });
    setupType.parse(this.setup);
    return this.setup as z.infer<typeof setupType>;
  }

  createUser(): z.infer<typeof setupType> {
    const setupType = z.object({
      login: authSchema,
      user: userSchema
    });
    setupType.parse(this.setup);
    // If undefined, set siteId to 1 (zod default / input not working as expected)
    if (this.setup.user) {
      this.setup.user.siteId = this.setup.user.siteId
        ? this.setup.user.siteId
        : '1';
    }
    return this.setup as z.infer<typeof setupType>;
  }

  getUser(): z.infer<typeof setupType> {
    const setupType = z.object({
      login: authSchema,
      user: getUserSchema
    });
    setupType.parse(this.setup);
    return this.setup as z.infer<typeof setupType>;
  }

  importUsers(): z.infer<typeof setupType> {
    const setupType = z.object({
      login: authSchema,
      config: importUsersSchema
    });
    setupType.parse(this.setup);
    return this.setup as z.infer<typeof setupType>;
  }

  downloadRuns(): z.infer<typeof setupType> {
    const setupType = z.object({
      login: authSchema,
      config: runSchema
    });
    setupType.parse(this.setup);
    return this.setup as z.infer<typeof setupType>;
  }

  downloadRun(): z.infer<typeof setupType> {
    const setupType = z.object({
      login: authSchema,
      config: runSchema,
      run: getRunSchema
    });
    setupType.parse(this.setup);
    return this.setup as z.infer<typeof setupType>;
  }
}
