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

import { SiteModel, siteModelSchema } from "./site";
import { Language, languageSchema } from "./language";
import { Problem, problemSchema } from "./problem";
import { z } from "zod";

export interface ContestModel {
  sites: SiteModel[];
  setup: {
    id?: number;
    name: string;
    startDate: string;
    endDate: string;
    stopAnswering?: number;
    stopScoreboard?: number;
    penalty?: number;
    maxFileSize?: number;
    mainSiteUrl?: string;
    mainSiteNumber: number;
    localSiteNumber: number;
    active: boolean;
  },
  languages: Language[],
  problems: Problem[]
}

export const contestModelSchema = z.object({
  sites: z.array(siteModelSchema).optional(),
  setup: z.object({
    id: z.number().optional(),
    name: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    stopAnswering: z.number().optional(),
    stopScoreboard: z.number().optional(),
    penalty: z.number().optional(),
    maxFileSize: z.number().optional(),
    mainSiteUrl: z.string().optional(),
    mainSiteNumber: z.number(),
    localSiteNumber: z.number(),
    active: z.boolean(),
  }),
  languages: z.array(languageSchema).optional(),
  problems: z.array(problemSchema).optional()
})
