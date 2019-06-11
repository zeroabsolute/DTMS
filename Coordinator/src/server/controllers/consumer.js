import Kue from 'kue';

import logger from '../logger';

const queue = Kue.createQueue();

export default (name) => {
  queue.process(name, (job, done) => {
    
      
    done();
  });
};