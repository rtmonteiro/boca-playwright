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
import * as path from 'path';
import { z } from 'zod';
import { authSchema } from './auth';
import { contestSchema } from './contest';
import { answerSchema } from './answer';
import { languageSchema } from './language';
import { problemSchema } from './problem';
import { runSchema } from './run';
import { siteSchema } from './site';
import { importUsersSchema, userSchema } from './user';
import { ReadMessages } from '../errors/read_errors';
import { Output } from '../output';

export type Setup = z.infer<typeof setupSchema>;

const resultSchema = z
  .string()
  .optional()
  .refine((filePath) => {
    if (!filePath) return true;
    const output = Output.getInstance();
    const dirPath = path.dirname(filePath);
    // Check if the path to file is writeable with fs.accessSync
    try {
      fs.accessSync(dirPath, fs.constants.W_OK);
      return true;
    } catch {
      return false;
    } finally {
      output.isActive = true;
    }
  }, ReadMessages.FORBIDDEN_PATH);

export const setupSchema = z.object({
  config: z
    .object({
      url: z.string().url(),
      userPath: z.string().optional(),
      resultFilePath: resultSchema
    })
    .merge(runSchema.partial())
    .merge(importUsersSchema.partial()),
  login: authSchema,
  contest: contestSchema.partial().optional(),
  answer: answerSchema.partial().optional(),
  language: languageSchema.partial().optional(),
  problem: problemSchema.partial().optional(),
  site: siteSchema.partial().optional(),
  user: userSchema.partial().optional()
});
