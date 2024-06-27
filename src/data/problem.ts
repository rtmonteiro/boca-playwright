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
import { z } from 'zod';
import { ProblemMessages, TypeMessages } from '../errors/read_errors';

export type Problem = z.infer<typeof problemSchema>;

export type CreateProblem = z.infer<typeof createProblemSchema>;

export type GetProblem = z.infer<typeof getProblemSchema>;

export type UpdateProblem = z.infer<typeof updateProblemSchema>;

export const problemSchema = z.object({
  id: z
    .string()
    .refine((value) => value !== undefined, ProblemMessages.ID_REQUIRED)
    .refine((value) => parseInt(value) > 0, {
      message: TypeMessages.POSITIVE_NUMBER_REQUIRED
    }),
  name: z
    .string()
    .refine(
      (value) => value !== undefined && value !== '',
      ProblemMessages.NAME_REQUIRED
    ),
  filePath: z
    .string()
    .refine(
      (value) => value.endsWith('.zip'),
      ProblemMessages.INVALID_FILE_EXTENSION
    )
    .refine((value) => {
      // Check if the file exists with fs.accessSync
      try {
        fs.accessSync(value, fs.constants.R_OK);
        return true;
      } catch {
        return false;
      }
    }, ProblemMessages.FILE_NOT_FOUND),
  colorName: z.string().optional(),
  colorCode: z
    .string()
    .refine(
      (value) => /^([0-9a-f]{3}){1,2}([0-9a-f]{2})?$/i.test(value),
      ProblemMessages.INVALID_COLOR_CODE
    )
    .optional(),
  isEnabled: z.union([z.literal('Yes'), z.literal('No')])
});

export const createProblemSchema = problemSchema.omit({
  isEnabled: true
});

export const getProblemSchema = problemSchema.pick({
  id: true
});

export const updateProblemSchema = createProblemSchema
  .partial()
  .refine((problem) => problem.id !== undefined, ProblemMessages.ID_REQUIRED)
  .refine((problem) => parseInt(problem.id!) > 0, {
    message: TypeMessages.POSITIVE_NUMBER_REQUIRED
  })
  .refine(
    (problem) =>
      problem.colorCode === undefined ||
      /^([0-9a-f]{3}){1,2}([0-9a-f]{2})?$/i.test(problem.colorCode),
    ProblemMessages.INVALID_COLOR_CODE
  );
