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
import { LanguageMessages, TypeMessages } from '../errors/read_errors';

export type Language = z.infer<typeof languageSchema>;

export type GetLanguage = z.infer<typeof getLanguageSchema>;

export const languageSchema = z.object({
  id: z
    .string()
    .refine((value) => value !== undefined, LanguageMessages.ID_REQUIRED)
    .refine((value) => parseInt(value) > 0, {
      message: TypeMessages.POSITIVE_NUMBER_REQUIRED
    }),
  name: z
    .string()
    .refine(
      (value) => value !== undefined && value !== '',
      LanguageMessages.NAME_REQUIRED
    )
    .refine(
      (value) => !value.includes(' '),
      LanguageMessages.NAME_WITHOUT_SPACES
    ),
  extension: z.string().optional()
});

export const getLanguageSchema = languageSchema.pick({
  id: true
});
