import { z } from "zod";
import { SetupModel } from "./setup";

export class Validate {

    createContestSchema = z.object({
        contests: z.array(z.object({
            setup: z.object({
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
                active: z.boolean(),
            })
        })),
    });

    loginSystemSchema = z.object({
        logins: z.object({
            system: z.object({
                username: z.string(),
                password: z.string(),
            }),
        }),
    })

    constructor(public setup: SetupModel) {}

    loginSystem() {
        this.loginSystemSchema.parse(this.setup);
    }

    createContest() {
        this.createContestSchema.parse(this.setup);
    }
}