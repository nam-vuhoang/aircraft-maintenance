import pino from 'pino';

// import prettier from 'pino-pretty'

const level = import.meta.env.VITE_LOG_LEVEL || 'info';

const logger = pino({ level });

logger.info('Logger level:', level)

// const logger = pino({
//     prettyPrint: { colorize: true },
//     prettifier: require('pino-pretty')
//   });

export default logger;
