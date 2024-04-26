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
import { ProblemErrors } from '../errors/read_errors';

export type Problem = z.infer<typeof problemSchema>;

export const problemSchema = z.object({
  id: z.number(),
  name: z.string(),
  filePath: z.string(),
  colorName: z.string().optional(),
  colorCode: z
    .string()
    .refine(
      (value) => /^([0-9a-f]{3}){1,2}([0-9a-f]{2})?$/i.test(value),
      ProblemErrors.INVALID_COLOR_CODE
    )
    .optional()
});
