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

export enum ExitErrors {
  OK = 0,
  NOT_ENOUGH_ARGUMENTS = 1,
  CONFIG_VALIDATION = 2,
  CONTEST_NOT_EXIST = 101
}

export enum ReadErrors {
  SETUP_NOT_FOUND = 'Setup file not found',
  SETUP_INVALID = 'Setup file is invalid',
  RESULT_FILE_NOT_FOUND = 'Result file not found'
}

export enum ProblemErrors {
  INVALID_COLOR_CODE = 'Invalid color code',
  INVALID_FILE_EXTENSION = 'Invalid file extension',
  FILE_NOT_FOUND = 'File not found'
}

export enum ContestErrors {
  CONTEST_ID_REQUIRED = 'Contest id is required',
  ONE_FIELD_REQUIRED = 'At least one field is required'
}
