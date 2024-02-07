import {z} from "zod";

export interface UserModel {
    userSiteNumber?: number;
    userNumber: string;
    userName: string;
    userIcpcId?: string;
    userType: 'Team' | 'Judge' | 'Admin' | 'Staff' | 'Score' | 'Site';
    userEnabled?: 'Yes' | 'No';
    userMultiLogin?: 'Yes' | 'No';
    userFullName: string;
    userDesc: string;
    userIp?: string;
    userPassword?: string;
    userChangePass?: 'Yes' | 'No';
}

export const userModelSchema = z.object({
    userSiteNumber: z.string().optional(),
    userNumber: z.number(),
    userName: z.string(),
    userIcpcId: z.string().optional(),
    userType: z.union([
        z.literal("Team"),
        z.literal("Judge"),
        z.literal("Admin"),
        z.literal("Staff"),
        z.literal("Score"),
        z.literal("Site")
    ]),
    userEnabled: z.union([z.literal("Yes"), z.literal("No")]).optional(),
    userMultiLogin: z.union([z.literal("Yes"), z.literal("No")]).optional(),
    userFullName: z.string(),
    userDesc: z.string(),
    userIp: z.string().ip().optional(),
    userPassword: z.string().optional(),
    userChangePass: z.union([z.literal("Yes"), z.literal("No")]).optional()
})

export const user: UserModel = {
    userSiteNumber: 1,
    userNumber: '2019202359',
    userName: 'ryanmonteiro',
    userType: 'Team',
    userFullName: 'Ryan Tavares Farias da Silva Monteiro',
    userDesc: 'Ryan Tavares Farias da Silva Monteiro',
    userPassword: 'boca',
    userChangePass: 'Yes',
}
