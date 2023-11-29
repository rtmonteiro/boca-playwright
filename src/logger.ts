import {createLogger, format, transports, Logger as LoggerW} from "winston";

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

    logInfo(message: string) {
        this.log.info({
            message: message
        });
    }

    logError(message: string) {
        this.log.error({
            message: message
        });
    }
}