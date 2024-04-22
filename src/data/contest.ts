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

export type TContest = z.infer<typeof contestSchema>;

export type TCreateContest = z.infer<typeof createContestSchema>;

export type TContestForm = z.infer<typeof contestFormSchema>;

export const contestSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    stopAnsweringDate: z.string(),
    stopScoreboardDate: z.string(),
    penaltyDate: z.string(),
    maxFileSize: z.number(),
    mainSiteUrl: z.string(),
    mainSiteNumber: z.number(),
    localSiteNumber: z.number(),
    active: z.boolean()
  })
  .partial();

export const createContestSchema = contestSchema.omit({ id: true });

export const contestFormSchema = z.object({
  id: z.string(),
  name: z.string(),
  startDate: z.string(),
  duration: z.string(),
  stopAnswering: z.string(),
  stopScoreboard: z.string(),
  penalty: z.string(),
  maxFileSize: z.string(),
  mainSiteUrl: z.string().optional(),
  mainSiteNumber: z.string(),
  localSiteNumber: z.string()
});

export class ContestForm implements TContestForm {
  id: string;
  name: string;
  startDate: string;
  duration: string;
  stopAnswering: string;
  stopScoreboard: string;
  penalty: string;
  maxFileSize: string;
  mainSiteUrl?: string;
  mainSiteNumber: string;
  localSiteNumber: string;

  constructor(contest?: TContestForm) {
    this.id = contest?.id ?? '';
    this.name = contest?.name ?? '';
    this.startDate = contest?.startDate ?? '';
    this.duration = contest?.duration ?? '';
    this.stopAnswering = contest?.stopAnswering ?? '';
    this.stopScoreboard = contest?.stopScoreboard ?? '';
    this.penalty = contest?.penalty ?? '';
    this.maxFileSize = contest?.maxFileSize ?? '';
    this.mainSiteUrl = contest?.mainSiteUrl ?? '';
    this.mainSiteNumber = contest?.mainSiteNumber ?? '';
    this.localSiteNumber = contest?.localSiteNumber ?? '';
  }
}
