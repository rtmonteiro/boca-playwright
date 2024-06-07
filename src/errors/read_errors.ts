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
  ARGS_VALIDATION = 1,
  CONFIG_VALIDATION = 12,
  CONTEST_ERROR = 13,
  LANGUAGE_ERROR = 14,
  PROBLEM_ERROR = 15,
  SITE_ERROR = 16,
  USER_ERROR = 17,
  LOGIN_ERROR = 18
}

export enum ReadMessages {
  CONFIG_NOT_FOUND = 'Config file not found.',
  SETUP_INVALID = 'Config file is invalid',
  RESULT_FILE_NOT_FOUND = 'Result file not found.',
  FORBIDDEN_PATH = "You don't have permission to access this path."
}

export enum TypeMessages {
  POSITIVE_NUMBER_REQUIRED = 'Must be a positive integer number.'
}

export enum ContestMessages {
  ID_REQUIRED = 'Contest number (id) should be provided.',
  NOT_FOUND = 'Contest not found.',
  NEGATIVE_DURATION = 'The end date must be greater than the start date.'
}

export enum LanguageMessages {
  ID_REQUIRED = 'Language number (id) should be provided.',
  NOT_FOUND = 'Language not found.'
}

export enum ProblemMessages {
  ID_REQUIRED = 'Problem number (id) should be provided.',
  FILE_NOT_FOUND = 'Problem package (.zip) not found.',
  INVALID_COLOR_CODE = 'Invalid color code (e.g., 00FF00).',
  INVALID_FILE_EXTENSION = 'Invalid problem package extension (.zip).',
  NOT_FOUND = 'Problem not found.'
}

export enum UserMessages {
  FILE_NOT_FOUND = 'File not found.',
  NOT_FOUND = 'User not found.',
  SITE_AND_ID_REQUIRED = 'Site and user number (id) should be provided.'
}

export enum LoginMessages {
  INVALID_USER = 'Invalid user',
  INVALID_PASSWORD = 'Invalid password',
  INVALID_TYPE = 'Invalid type'
}

type ErrorMessages =
  | ReadMessages
  | TypeMessages
  | ContestMessages
  | LanguageMessages
  | LoginMessages
  | ProblemMessages
  | UserMessages;

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

export class LoginError extends ErrorBase {
  constructor(message: LoginMessages, cause?: unknown) {
    super({ code: ExitErrors.CONFIG_VALIDATION, message, cause });
  }
}

export class ContestError extends ErrorBase {
  constructor(message: ContestMessages, cause?: unknown) {
    super({ code: ExitErrors.CONTEST_ERROR, message, cause });
  }
}

export class LanguageError extends ErrorBase {
  constructor(message: LanguageMessages, cause?: unknown) {
    super({ code: ExitErrors.LANGUAGE_ERROR, message, cause });
  }
}

export class ProblemError extends ErrorBase {
  constructor(message: ProblemMessages, cause?: unknown) {
    super({ code: ExitErrors.PROBLEM_ERROR, message, cause });
  }
}

export class UserError extends ErrorBase {
  constructor(message: UserMessages, cause?: unknown) {
    super({ code: ExitErrors.USER_ERROR, message, cause });
  }
}
