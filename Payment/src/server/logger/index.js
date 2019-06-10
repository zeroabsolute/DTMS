import config from '../config';

import * as bunyanDriver from './bunyan';

let loggerService = bunyanDriver;

switch (config.loggerService) {
  case 'bunyan':
    loggerService = bunyanDriver;
    break;
  default:
    loggerService = bunyanDriver;
    break;
}

export default loggerService;