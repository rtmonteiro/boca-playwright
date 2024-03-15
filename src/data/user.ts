// ========================================================================
// Copyright Universidade Federal do Espirito Santo (Ufes)
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
//
// This program is released under license GNU GPL v3+ license.
//
// ========================================================================

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
