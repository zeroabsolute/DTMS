import * as createHandler from './create';
import * as readHandler from './read';
import * as deleteHandler from './delete';

export default {
  create: createHandler,
  read: readHandler,
  delete: deleteHandler,
};