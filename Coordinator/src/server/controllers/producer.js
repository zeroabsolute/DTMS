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

export const createJob = (name, params, priority, attempts = 1) => {
  return queue.create(name, params)
              .attempts(attempts)
              .backoff({ type: 'exponential' })
              .priority(priority)
              .removeOnComplete(true)
              .save();
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
    Name: ${name}
  `);
  });

  queue.on('job complete', (id, result) => {
    logger.getLogger().debug(`
    Job execution completed:
    ID: ${id}
  `);
  });
};

/**
 * Return queue.
 */

export const getQueue = () => queue;