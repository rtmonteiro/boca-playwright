import { z } from "zod"

export interface Language {
    id: number;
    name: string;
    extension: string;
}

export const languageSchema = z.object({
    id: z.number(),
    name: z.string(),
    extension: z.string()
})
