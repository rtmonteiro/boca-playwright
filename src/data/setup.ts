import {UserModel} from "./user";
import {LoginModel} from "./login";
import {Contest} from "./contest";

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
