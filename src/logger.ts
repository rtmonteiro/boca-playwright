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

import { createLogger, format, transports, Logger as LoggerW } from "winston";
import { ZodError } from "zod";
import { ReadErrors } from "./errors/read_errors";

export class Logger {

  private static instance: Logger;

  log : LoggerW;

  private constructor() {
    this.log = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({stack: true}),
        format.splat(),
        format.json(),
        format.colorize(),
        format.printf(({level, message, timestamp}) => {
          return `${timestamp} ${level}: ${message}`;
        })
      ),
      defaultMeta: {service: 'user-service'},
      transports: [
        new transports.Console()
      ]
    });
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }

    return Logger.instance;
  }

  logInfo(message: string, ...params: any[]) {
    this.log.info(message, ...params);
  }

  logError(message: string, ...params: any[]) {
    this.log.error(message, ...params);
  }

  logZodError(error: ZodError) {
    this.log.error(ReadErrors.SETUP_INVALID);
    console.error(error.errors);
  }

}
