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

export type UpdateContest = z.infer<typeof updateContestSchema>;

export type CreateContest = z.infer<typeof createContestSchema>;

export type Contest = z.infer<typeof contestSchema>;

export const contestSchema = z.object({
  id: z.string().refine((value) => parseInt(value) > 0, {
    message: 'Must be an positive integer number'
  }),
  name: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  stopAnsweringDate: z.string(),
  stopScoreboardDate: z.string(),
  penalty: z.string(),
  maxFileSize: z.string().refine((value) => parseInt(value), {
    message: 'Must be an positive integer number'
  }),
  mainSiteUrl: z.string(),
  mainSiteNumber: z.string().refine((value) => parseInt(value), {
    message: 'Must be an positive integer number'
  }),
  localSiteNumber: z.string().refine((value) => parseInt(value), {
    message: 'Must be an positive integer number'
  })
});

export const updateContestSchema = contestSchema.partial();

export const createContestSchema = contestSchema.partial().omit({ id: true });
