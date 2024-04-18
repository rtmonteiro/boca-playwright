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

import { z } from 'zod';

export type User = z.infer<typeof userSchema>;

export const userSchema = z.object({
  userSiteNumber: z.number().optional(),
  userNumber: z.string(),
  userName: z.string(),
  userIcpcId: z.string().optional(),
  userType: z.union([
    z.literal('Team'),
    z.literal('Judge'),
    z.literal('Admin'),
    z.literal('Staff'),
    z.literal('Score'),
    z.literal('Site')
  ]),
  userEnabled: z.union([z.literal('Yes'), z.literal('No')]).optional(),
  userMultiLogin: z.union([z.literal('Yes'), z.literal('No')]).optional(),
  userFullName: z.string(),
  userDesc: z.string(),
  userIp: z.string().ip().optional(),
  userPassword: z.string().optional(),
  userChangePass: z.union([z.literal('Yes'), z.literal('No')]).optional()
});

export const deleteUserSchema = userSchema.pick({ userName: true });
