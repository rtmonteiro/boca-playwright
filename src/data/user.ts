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

export type UserId = z.infer<typeof userIdSchema>;

export const insertUsersSchema = z.object({
  userPath: z.string()
});

export const userSchema = z.object({
  userSiteNumber: z
    .string()
    .refine((value) => parseInt(value) > 0, {
      message: 'Must be an positive integer number'
    })
    .optional(),
  userNumber: z.string().refine((value) => parseInt(value) > 0, {
    message: 'Must be an positive integer number'
  }),
  userName: z.string(),
  userIcpcId: z.string().optional(),
  userType: z
    .union([
      z.literal('Team'),
      z.literal('Judge'),
      z.literal('Admin'),
      z.literal('Staff'),
      z.literal('Score'),
      z.literal('Site')
    ])
    .optional(),
  userEnabled: z.union([z.literal('Yes'), z.literal('No')]).optional(),
  userMultiLogin: z.union([z.literal('Yes'), z.literal('No')]).optional(),
  userFullName: z.string().optional(),
  userDesc: z.string().optional(),
  userIp: z.string().ip().optional(),
  userPassword: z.string().optional(),
  userChangePass: z.union([z.literal('Yes'), z.literal('No')]).optional()
});

export const userIdSchema = userSchema
  .pick({
    userNumber: true
  })
  .partial()
  .refine((user) => user.userNumber !== undefined, 'Id should be provided.');
