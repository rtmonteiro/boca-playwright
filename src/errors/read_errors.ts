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
  NOT_ENOUGH_ARGUMENTS = 11,
  CONFIG_VALIDATION = 12,
  CONTEST_ERROR = 13,
  PROBLEM_ERROR = 14,
  LOGIN_ERROR = 15
}

export enum ReadMessages {
  SETUP_NOT_FOUND = 'Setup file not found',
  SETUP_INVALID = 'Setup file is invalid',
  RESULT_FILE_NOT_FOUND = 'Result file not found',
  FORBIDDEN_PATH = "You don't have permission to access this path"
}

export enum ProblemMessages {
  NOT_FOUND = 'Problem not found',
  INVALID_COLOR_CODE = 'Invalid color code',
  INVALID_FILE_EXTENSION = 'Invalid file extension',
  FILE_NOT_FOUND = 'File not found',
  ONLY_ID_OR_NAME_REQUIRED = 'Only one of id or name should be provided.'
}

export enum ContestMessages {
  NOT_FOUND = 'Contest not found',
  CONTEST_ID_REQUIRED = 'Contest id is required',
  ONE_FIELD_REQUIRED = 'At least one field is required',
  NEGATIVE_DURATION = 'The end date must be greater than the start date'
}

export enum LoginMessages {
  INVALID_USER = 'Invalid user',
  INVALID_PASSWORD = 'Invalid password',
  INVALID_TYPE = 'Invalid type'
}

type ErrorMessages =
  | ReadMessages
  | ProblemMessages
  | ContestMessages
  | LoginMessages;

export class ErrorBase extends Error {
  code: number;
  cause?: unknown;

  constructor({
    code,
    message,
    cause
  }: {
    code: number;
    message: ErrorMessages;
    cause?: unknown;
  }) {
    super(message);
    this.code = code;
    this.cause = cause;
  }
}

export class ContestError extends ErrorBase {
  constructor(message: ContestMessages, cause?: unknown) {
    super({ code: ExitErrors.CONTEST_ERROR, message, cause });
  }
}

export class ProblemError extends ErrorBase {
  constructor(message: ProblemMessages, cause?: unknown) {
    super({ code: ExitErrors.PROBLEM_ERROR, message, cause });
  }
}

export class LoginError extends ErrorBase {
  constructor(message: LoginMessages, cause?: unknown) {
    super({ code: ExitErrors.CONFIG_VALIDATION, message, cause });
  }
}
