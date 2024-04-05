import { z } from 'zod';
import { ProblemErrors } from '../errors/read_errors';

export interface Problem {
  id: number
  name: string
  filePath: string
  colorName?: string
  colorCode?: string
}

export const problemSchema = z.object({
  id: z.number(),
  name: z.string(),
  filePath: z.string(),
  colorName: z.string().optional(),
  colorCode: z.string()
    .refine(
      (value) => /^([0-9a-f]{3}){1,2}([0-9a-f]{2})?$/i.test(value),
      ProblemErrors.INVALID_COLOR_CODE
    )
    .optional()
});
