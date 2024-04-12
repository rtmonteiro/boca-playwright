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
import { type SetupModel } from './setup';
import { contestConfigSchema, contestModelSchema } from './contest';
import { userModelSchema } from './user';
import { loginModelSchema } from './login';
import { siteModelSchema } from './site';
import { problemSchema } from './problem';
import { languageSchema } from './language';

export class Validate {
  private readonly loginSchema = z.object({
    login: loginModelSchema
  });

  private readonly createContestSchema = z.object({
    contest: contestModelSchema
  });

  private readonly updateContestSchema = z.object({
    contest: contestModelSchema.merge(
      z.object({
        config: contestConfigSchema.merge(
          z.object({
            id: z.number()
          })
        )
      })
    )
  });

  private readonly clearContestSchema = z.object({
    contest: contestModelSchema.merge(
      z.object({
        config: z.object({
          id: z.number()
        })
      })
    )
  });

  private readonly createUsersSchema = z.object({
    user: userModelSchema
  });

  private readonly insertUsersSchema = z.object({
    config: z.object({
      userPath: z.string()
    })
  });

  private readonly deleteUserSchema = z.object({
    user: z.object({
      userName: z.string()
    })
  });

  private readonly createSiteSchema = z.object({
    site: siteModelSchema
  });

  private readonly createProblemSchema = z.object({
    problems: z.array(problemSchema)
  });

  private readonly createLanguagesSchema = z.object({
    languages: z.array(languageSchema)
  });

  private readonly deleteLanguagesSchema = z.object({
    languages: z.array(
      z.object({
        name: z.string()
      })
    )
  });

  private readonly generateReportSchema = z.object({
    config: z.object({
      outDir: z.string()
    })
  });

  constructor(public setup: SetupModel) {}

  createContest(): z.infer<typeof opType> {
    this.loginSchema.parse(this.setup);
    this.createContestSchema.parse(this.setup);
    const opType = this.loginSchema.merge(this.createContestSchema);
    return this.setup as z.infer<typeof opType>;
  }

  updateContest(): z.infer<typeof opType> {
    this.loginSchema.parse(this.setup);
    this.updateContestSchema.parse(this.setup);
    const opType = this.loginSchema.merge(this.updateContestSchema);
    return this.setup as z.infer<typeof opType>;
  }

  clearContest(): z.infer<typeof opType> {
    this.loginSchema.parse(this.setup);
    this.clearContestSchema.parse(this.setup);
    const opType = this.loginSchema.merge(this.clearContestSchema);
    return this.setup as z.infer<typeof opType>;
  }

  createUser(): z.infer<typeof opType> {
    this.loginSchema.parse(this.setup);
    this.createUsersSchema.parse(this.setup);
    const opType = this.loginSchema.merge(this.createUsersSchema);
    return this.setup as z.infer<typeof opType>;
  }

  insertUsers(): z.infer<typeof opType> {
    this.loginSchema.parse(this.setup);
    this.insertUsersSchema.parse(this.setup);
    const opType = this.loginSchema.merge(this.insertUsersSchema);
    return this.setup as z.infer<typeof opType>;
  }

  deleteUser(): z.infer<typeof opType> {
    this.loginSchema.parse(this.setup);
    this.deleteUserSchema.parse(this.setup);
    const opType = this.loginSchema.merge(this.deleteUserSchema);
    return this.setup as z.infer<typeof opType>;
  }

  createSite(): z.infer<typeof opType> {
    this.loginSchema.parse(this.setup);
    this.createSiteSchema.parse(this.setup);
    const opType = this.loginSchema.merge(this.createSiteSchema);
    return this.setup as z.infer<typeof opType>;
  }

  createProblem(): z.infer<typeof opType> {
    this.loginSchema.parse(this.setup);
    this.createProblemSchema.parse(this.setup);
    const opType = this.loginSchema.merge(this.createProblemSchema);
    return this.setup as z.infer<typeof opType>;
  }

  createLanguages(): z.infer<typeof opType> {
    this.loginSchema.parse(this.setup);
    this.createLanguagesSchema.parse(this.setup);
    const opType = this.loginSchema.merge(this.createLanguagesSchema);
    return this.setup as z.infer<typeof opType>;
  }

  deleteLanguages(): z.infer<typeof opType> {
    this.loginSchema.parse(this.setup);
    this.deleteLanguagesSchema.parse(this.setup);
    const opType = this.loginSchema.merge(this.deleteLanguagesSchema);
    return this.setup as z.infer<typeof opType>;
  }

  generateReport(): z.infer<typeof opType> {
    this.loginSchema.parse(this.setup);
    this.generateReportSchema.parse(this.setup);
    const opType = this.loginSchema.merge(this.generateReportSchema);
    return this.setup as z.infer<typeof opType>;
  }
}
