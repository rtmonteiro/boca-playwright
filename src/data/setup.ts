import {UsuarioModel} from "./user.ts";
import {LoginModel} from "./login.ts";
import {Contest} from "../scripts/system.ts";

export interface SetupModel {
    setup: {
        url: string,
        contestId: string,
        userPath: string,
    },
    logins: LoginModel[],
    users: UsuarioModel[],
    contests: Contest[],
}