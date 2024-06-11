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
import { TypeMessages, ContestMessages } from '../errors/read_errors';

export type UpdateContest = z.infer<typeof updateContestSchema>;

export type CreateContest = z.infer<typeof createContestSchema>;

export type Contest = z.infer<typeof contestSchema>;

export const contestSchema = z.object({
  id: z.string().refine((value) => parseInt(value) > 0, {
    message: TypeMessages.POSITIVE_NUMBER_REQUIRED
  }),
  name: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  stopAnsweringDate: z.string().optional(),
  stopScoreboardDate: z.string().optional(),
  penalty: z
    .string()
    .refine((value) => parseInt(value), {
      message: TypeMessages.POSITIVE_NUMBER_REQUIRED
    })
    .optional(),
  maxFileSize: z
    .string()
    .refine((value) => parseInt(value), {
      message: TypeMessages.POSITIVE_NUMBER_REQUIRED
    })
    .optional(),
  mainSiteUrl: z.string().optional(),
  mainSiteId: z
    .string()
    .refine((value) => parseInt(value), {
      message: TypeMessages.POSITIVE_NUMBER_REQUIRED
    })
    .optional(),
  localSiteId: z
    .string()
    .refine((value) => parseInt(value), {
      message: TypeMessages.POSITIVE_NUMBER_REQUIRED
    })
    .optional(),
  isActive: z.union([z.literal('Yes'), z.literal('No')])
});

export const updateContestSchema = contestSchema
  .partial()
  .omit({ isActive: true })
  .refine((contest) => contest.id !== undefined, ContestMessages.ID_REQUIRED);

export const createContestSchema = contestSchema
  .partial()
  .omit({ id: true, isActive: true });
