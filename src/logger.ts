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

/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  createLogger,
  format,
  transports,
  type Logger as LoggerW
} from 'winston';
import { type ZodError } from 'zod';
import { ReadErrors } from './errors/read_errors';

export class Logger {
  private static instance: Logger | null = null;

  log: LoggerW;

  private constructor() {
    this.log = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
        format.colorize(),
        format.printf(({ level, message, timestamp }) => {
          return `${timestamp} ${level}: ${message}`;
        })
      ),
      defaultMeta: { service: 'user-service' },
      transports: [new transports.Console()]
    });
  }

  public static getInstance(enable?: boolean): Logger {
    if (Logger.instance === null) {
      Logger.instance = new Logger();
      Logger.instance.log.level = enable ? 'info' : 'error';
    }

    return Logger.instance;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logInfo(message: string, ...params: any[]): void {
    this.log.info(message, ...params);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logError(message: string, ...params: any[]): void {
    this.log.error(message, ...params);
  }

  logZodError(error: ZodError): void {
    this.log.error(ReadErrors.SETUP_INVALID);
    console.error(error.errors);
  }
}
