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
import { insertUsersSchema, userSchema } from './user';
import { loginSchema } from './login';
import { contestSchema } from './contest';
import { siteSchema } from './site';
import { languageSchema } from './language';
import { problemSchema } from './problem';
import { reportSchema } from './report';

export type Setup = z.infer<typeof setupSchema>;

export const setupSchema = z.object({
  config: z
    .object({
      url: z.string().url(),
      userPath: z.string().optional(),
      resultFilePath: z.string().optional()
    })
    .merge(reportSchema.partial())
    .merge(insertUsersSchema.partial()),
  login: loginSchema,
  user: userSchema.partial().optional(),
  contest: contestSchema.partial().optional(),
  site: siteSchema.partial().optional(),
  language: languageSchema.partial().optional(),
  problem: problemSchema.partial().optional()
});
