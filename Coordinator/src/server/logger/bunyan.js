import Bunyan from 'bunyan';
import path from 'path';

import config from '../config';

let logger = null;

/**
 * Express logger config.
 */

export const expressLoggerConfig = {
  name: config.appName,
  streams: [
    {
      level: 'info',
      path: path.resolve(__dirname, `../../../logs/${config.appName}-logs-info.log`),
      period: '3d',
      count: 3,
    }
  ],
};

/**
 * Generates a Bunyan logger service.
 * Will be called during server initialization.
 */

export const initLoggerService = () => {
  logger = Bunyan.createLogger({
    name: config.appName,
    streams: [
      {
        level: 'debug',
        stream: process.stdout,
      }, {
        level: 'info',
        path: path.resolve(__dirname, `../../../logs/${config.appName}-logs-info.log`),
      }, {
        level: 'warn',
        path: path.resolve(__dirname, `../../../logs/${config.appName}-logs-warn.log`),
      }, {
        level: 'error',
        path: path.resolve(__dirname, `../../../logs/${config.appName}-logs-error.log`),
      }, {
        level: 'fatal',
        path: path.resolve(__dirname, `../../../logs/${config.appName}-logs-fatal.log`),
      }
    ],
  }); 
};

export const getLogger = () => logger;
