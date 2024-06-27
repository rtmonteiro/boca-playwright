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
import { ContestMessages, TypeMessages } from '../errors/read_errors';

export type Contest = z.infer<typeof contestSchema>;

export type CreateContest = z.infer<typeof createContestSchema>;

export type GetContest = z.infer<typeof getContestSchema>;

export type UpdateContest = z.infer<typeof updateContestSchema>;

export const contestSchema = z.object({
  id: z
    .string()
    .refine((value) => parseInt(value) > 0, {
      message: TypeMessages.POSITIVE_NUMBER_REQUIRED
    })
    .refine((value) => value !== undefined, ContestMessages.ID_REQUIRED),
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

export const createContestSchema = contestSchema.omit({
  id: true,
  isActive: true
});

export const getContestSchema = contestSchema.pick({
  id: true
});

export const updateContestSchema = contestSchema.omit({ isActive: true });
