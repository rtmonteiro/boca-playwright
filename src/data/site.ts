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

export type Site = z.infer<typeof siteSchema>;

// TODO - Test which fields are required, if any
export const siteSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  stopAnsweringDate: z.string(),
  stopScoreboardDate: z.string(),
  runs: z.number(),
  tasks: z.number(),
  chiefUsername: z.string(),
  active: z.boolean(),
  autoEnd: z.boolean(),
  globalScore: z.number().optional(),
  autoJudge: z.boolean().optional(),
  scoreLevel: z.number().optional(),
  globalScoreboard: z.number().optional()
});
