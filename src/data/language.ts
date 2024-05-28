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

export type Language = z.infer<typeof languageSchema>;

export type LanguageId = z.infer<typeof languageIdSchema>;

export const languageSchema = z.object({
  id: z.string().refine((value) => parseInt(value) > 0, {
    message: 'Must be an positive integer number'
  }),
  name: z.string(),
  extension: z.string().optional()
});

export const languageIdSchema = languageSchema
  .pick({
    id: true
  })
  .partial()
  .refine((language) => language.id !== undefined, 'Id should be provided.');
