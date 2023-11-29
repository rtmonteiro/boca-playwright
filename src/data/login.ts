import {z} from "zod";

export interface LoginModel {
    username: string;
    password: string;
}

export const loginModelSchema = z.object({
    username: z.string(),
    password: z.string()
})

export const admin: LoginModel = {
    username: 'admin',
    password: 'boca',
}

export const system: LoginModel = {
    username: 'system',
    password: 'boca',
}