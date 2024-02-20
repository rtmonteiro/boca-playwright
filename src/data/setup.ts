import {UserModel} from "./user";
import {LoginModel} from "./login";
import {ContestModel} from "./contest";
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
    user: UserModel,
    contests: ContestModel[],
}

export const setupModelSchema = z.object({
    setup: z.object({
        url: z.string().url(),
    })
});