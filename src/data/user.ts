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

import * as fs from 'fs';
import { z } from 'zod';
import { TypeMessages, UserMessages } from '../errors/read_errors';

export type User = z.infer<typeof userSchema>;

export type UserId = z.infer<typeof userIdSchema>;

export const importUsersSchema = z.object({
  userPath: z.string().refine((path) => {
    // Check if the file exists with fs.accessSync
    try {
      fs.accessSync(path, fs.constants.R_OK);
      return true;
    } catch {
      return false;
    }
  }, UserMessages.FILE_NOT_FOUND)
});

export const userSchema = z.object({
  siteId: z
    .string()
    .refine((value) => parseInt(value) > 0, {
      message: TypeMessages.POSITIVE_NUMBER_REQUIRED
    })
    .optional(),
  id: z.string().refine((value) => parseInt(value) > 0, {
    message: TypeMessages.POSITIVE_NUMBER_REQUIRED
  }),
  username: z.string(),
  icpcId: z.string().optional(),
  type: z
    .union([
      z.literal('Team'),
      z.literal('Judge'),
      z.literal('Admin'),
      z.literal('Staff'),
      z.literal('Score'),
      z.literal('Site')
    ])
    .optional(),
  isEnabled: z.union([z.literal('Yes'), z.literal('No')]).optional(),
  isMultiLogin: z.union([z.literal('Yes'), z.literal('No')]).optional(),
  fullName: z.string().optional(),
  description: z.string().optional(),
  ip: z.string().ip().optional(),
  password: z.string().optional(),
  allowPasswordChange: z.union([z.literal('Yes'), z.literal('No')]).optional()
});

export const userIdSchema = userSchema
  .pick({
    siteId: true,
    id: true
  })
  .refine(
    (user) => user.siteId !== undefined && user.id !== undefined,
    UserMessages.SITE_AND_ID_REQUIRED
  );
