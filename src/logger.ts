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

  public static getInstance(): Logger {
    if (Logger.instance === null) {
      Logger.instance = new Logger();
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
