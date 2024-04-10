import { z } from 'zod';

export interface SiteModel {
  id?: number;
  name: string;
  startDate: string;
  endDate: string;
  runs: number;
  tasks: number;
  chiefUsername: string;
  active: boolean;
  autoEnd: boolean;
  globalScore?: number;
  autoJudge?: boolean;
  scoreLevel?: number;
  globalScoreboard?: number;
}

export const siteModelSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  startDate: z.string(),
  endDate: z.string(),
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
