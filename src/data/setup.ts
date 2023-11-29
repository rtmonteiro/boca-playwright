import {UserModel, userModelSchema} from "./user";
import {LoginModel, loginModelSchema} from "./login";
import {ContestModel, contestModelSchema} from "./contest";
import {z} from "zod";

export interface SetupModel {
    setup: {
        url: string,
        userPath: string,
        outDir: string;
    },
    logins: {
        system: LoginModel,
        admin: LoginModel,
    },
    users: UserModel[],
    contests: ContestModel[],
}

export const setupModelSchema = z.object({
    setup: z.object({
        url: z.string().url(),
        userPath: z.string(),
        outDir: z.string(),
    }),
    logins: z.object({
        system: loginModelSchema,
        admin: loginModelSchema,
    }),
    users: z.array(userModelSchema).optional(),
    contests: z.array(contestModelSchema).optional(),
});