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
import { AnswerMessages, TypeMessages } from '../errors/read_errors';

export type Answer = z.infer<typeof answerSchema>;

export type GetAnswer = z.infer<typeof getAnswerSchema>;

export const answerSchema = z.object({
  id: z
    .string()
    .refine((value) => value !== undefined, AnswerMessages.ID_REQUIRED)
    .refine((value) => parseInt(value) > 0, {
      message: TypeMessages.POSITIVE_NUMBER_REQUIRED
    }),
  description: z
    .string()
    .refine(
      (value) => value !== undefined && value !== '',
      AnswerMessages.DESC_REQUIRED
    ),
  shortname: z.string().optional(),
  type: z.union([z.literal('Yes'), z.literal('No')]).optional()
});

export const getAnswerSchema = answerSchema.pick({
  id: true
});
