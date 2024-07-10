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
import { SiteMessages, TypeMessages } from '../errors/read_errors';

export type Site = z.infer<typeof siteSchema>;

export type GetSite = z.infer<typeof getSiteSchema>;

// TODO - Test which fields are required, if any
export const siteSchema = z.object({
  id: z
    .string()
    .refine((value) => parseInt(value) > 0, {
      message: TypeMessages.POSITIVE_NUMBER_REQUIRED
    })
    .refine((value) => value !== undefined, SiteMessages.ID_REQUIRED),
  name: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  stopAnsweringDate: z.string().optional(),
  stopScoreboardDate: z.string().optional(),
  runsClarsSiteIds: z.string().optional(),
  tasksSiteIds: z.string().optional(),
  globalScoreSiteIds: z.string().optional(),
  chiefUsername: z.string().optional(),
  isActive: z.union([z.literal('Yes'), z.literal('No')]).optional(),
  enableAutoEnd: z.union([z.literal('Yes'), z.literal('No')]).optional(),
  enableAutoJudge: z.union([z.literal('Yes'), z.literal('No')]).optional(),
  scoreLevel: z
    .union([
      z.literal('-4'),
      z.literal('-3'),
      z.literal('-2'),
      z.literal('-1'),
      z.literal('0'),
      z.literal('1'),
      z.literal('2'),
      z.literal('3'),
      z.literal('4')
    ])
    .optional()
});

export const getSiteSchema = siteSchema.pick({
  id: true
});
