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

import { z } from 'zod';
import { type Setup } from './setup';
import { deleteUserSchema, insertUsersSchema, userSchema } from './user';
import { loginSchema } from './login';
import { siteSchema } from './site';
import { problemSchema } from './problem';
import { deleteLanguageSchema, languageSchema } from './language';
import { createContestSchema, updateContestSchema } from './contest';
import { reportSchema } from './report';
import { ContestErrors } from '../errors/read_errors';

export class Validate {
  constructor(public setup: Setup) {}

  createContest(): z.infer<typeof setupType> {
    const setupType = z.object({
      login: loginSchema,
      contest: createContestSchema.optional()
    });
    setupType.parse(this.setup);
    return this.setup as z.infer<typeof setupType>;
  }

  updateContest(): z.infer<typeof setupType> {
    const setupType = z.object({
      login: loginSchema,
      contest: updateContestSchema
        .refine((contest) => contest.id !== undefined, {
          message: ContestErrors.CONTEST_ID_REQUIRED
        })
        .refine(
          (contest) =>
            !Object.entries(contest)
              .filter(([k]) => k !== 'id')
              .every(([, v]) => v === undefined),
          {
            message: ContestErrors.ONE_FIELD_REQUIRED
          }
        )
    });
    setupType.parse(this.setup);
    return this.setup as z.infer<typeof setupType>;
  }

  createUser(): z.infer<typeof setupType> {
    const setupType = z.object({
      login: loginSchema,
      user: userSchema
    });
    setupType.parse(this.setup);
    return this.setup as z.infer<typeof setupType>;
  }

  insertUsers(): z.infer<typeof setupType> {
    const setupType = z.object({
      login: loginSchema,
      config: insertUsersSchema
    });
    setupType.parse(this.setup);
    return this.setup as z.infer<typeof setupType>;
  }

  deleteUser(): z.infer<typeof setupType> {
    const setupType = z.object({
      login: loginSchema,
      user: deleteUserSchema
    });
    setupType.parse(this.setup);
    return this.setup as z.infer<typeof setupType>;
  }

  createSite(): z.infer<typeof setupType> {
    const setupType = z.object({
      login: loginSchema,
      site: siteSchema // TODO - Review if it should be optional
    });
    setupType.parse(this.setup);
    return this.setup as z.infer<typeof setupType>;
  }

  createProblem(): z.infer<typeof setupType> {
    const setupType = z.object({
      login: loginSchema,
      problem: problemSchema
    });
    setupType.parse(this.setup);
    return this.setup as z.infer<typeof setupType>;
  }

  createLanguage(): z.infer<typeof setupType> {
    const setupType = z.object({
      login: loginSchema,
      language: languageSchema
    });
    setupType.parse(this.setup);
    return this.setup as z.infer<typeof setupType>;
  }

  deleteLanguage(): z.infer<typeof setupType> {
    const setupType = z.object({
      login: loginSchema,
      language: deleteLanguageSchema
    });
    setupType.parse(this.setup);
    return this.setup as z.infer<typeof setupType>;
  }

  generateReport(): z.infer<typeof setupType> {
    const setupType = z.object({
      login: loginSchema,
      config: reportSchema
    });
    setupType.parse(this.setup);
    return this.setup as z.infer<typeof setupType>;
  }
}
