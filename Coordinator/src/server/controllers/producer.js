import Kue from 'kue';

import logger from '../logger';

let queue = null;

/**
 * Job creation.
 * 
 * @param name
 * @param params
 * @param priority
 */

export const createJob = (name, params, priority) => {
  return queue.create(name, params).priority(priority).removeOnComplete(true).save();
};

/**
 * Producer initialization
 */

export default () => {
  queue = Kue.createQueue();

  queue.on('job enqueue', (id, name) => {
    logger.getLogger().debug(`
    Job enqueued:
    ID: ${id}
    Name: ${name}\n\n
  `);
  });

  queue.on('job complete', (id, result) => {
    logger.getLogger().debug(`
    Job execution completed:
    ID: ${id}\n\n
  `);
  });
};

/**
 * Return queue.
 */

export const getQueue = () => queue;