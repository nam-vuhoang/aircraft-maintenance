import pino from 'pino';

// import prettier from 'pino-pretty'

const logger = pino();

// const logger = pino({
//     prettyPrint: { colorize: true },
//     prettifier: require('pino-pretty')
//   });

export default logger;
