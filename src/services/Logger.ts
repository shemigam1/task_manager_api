import {
	format,
	createLogger,
	transports,
	addColors,
	Logger as WinstonLogger,
} from 'winston';
import config from '../helpers/config';

class Logger {
	logger: WinstonLogger;

	constructor() {
		this.logger = createLogger({
			transports: [
				new transports.Console({ silent: config.nodeEnv === 'test' }),
				new transports.File({ filename: 'error.log', level: 'error' }),
				new transports.File({ filename: 'combined.log' }),
			],
			format: format.combine(
				format.timestamp({
					format: 'YYYY-MM-DD HH:mm:ss',
				}),
				format.errors({ stack: true }),
				format.padLevels(),
				format.printf((info) =>
					format
						.colorize()
						.colorize(
							info.level,
							`${info.timestamp} ${info.level.toUpperCase()}: ${info.message}`
						)
				)
			),
		});

		addColors({
			error: 'bold red',
			warn: 'bold yellow',
			info: 'bold cyan',
			debug: 'bold green',
		});
	}
}

export default Logger;
