import {UserModel} from "./user.ts";
import {LoginModel} from "./login.ts";
import {Contest} from "./contest.ts";

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
    contests: Contest[],
}
