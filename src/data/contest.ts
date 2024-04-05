import { type SiteModel, siteModelSchema } from './site';
import { type Language, languageSchema } from './language';
import { type Problem, problemSchema } from './problem';
import { z } from 'zod';

export interface ContestModel {
  sites: SiteModel[]
  setup: {
    id?: number
    name: string
    startDate: string
    endDate: string
    stopAnswering?: number
    stopScoreboard?: number
    penalty?: number
    maxFileSize?: number
    mainSiteUrl?: string
    mainSiteNumber: number
    localSiteNumber?: number
    active: boolean
  }
  languages: Language[]
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
    localSiteNumber: z.number().optional(),
    active: z.boolean()
  }),
  languages: z.array(languageSchema).optional(),
  problems: z.array(problemSchema).optional()
});
