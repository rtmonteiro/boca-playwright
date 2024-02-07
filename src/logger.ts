import {createLogger, format, transports, Logger as LoggerW} from "winston";
import {ZodError} from "zod";
import {ReadErrors} from "./errors/read_errors";

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