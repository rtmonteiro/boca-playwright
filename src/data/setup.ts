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
import { userModelSchema } from './user';
import { loginModelSchema } from './login';
import { contestModelSchema } from './contest';
import { siteModelSchema } from './site';
import { languageSchema } from './language';
import { problemSchema } from './problem';

export type SetupModel = z.infer<typeof setupModelSchema>;

export const setupModelSchema = z.object({
  config: z.object({
    url: z.string().url(),
    userPath: z.string().optional(),
    outDir: z.string().optional()
  }),
  login: loginModelSchema,
  user: userModelSchema.optional(),
  contest: contestModelSchema.optional(),
  site: siteModelSchema.optional(),
  languages: z.array(languageSchema).optional(),
  problems: z.array(problemSchema).optional()
});
