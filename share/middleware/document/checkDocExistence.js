import invariant from 'invariant';

import Errors from '../../errors';

export default (config = () => ({})) => async (next, root, args, context) => {
  /* eslint-disable prefer-const */
  let {
    entity,
    collection,
    query,
    errorMessage = Errors.NOT_FOUND,
  } = await config(root, args, context);
  /* eslint-enable prefer-const */

  invariant(entity || collection, 'entity or collection is required');

  if (!entity) {
    if (!query) {
      query = { _id: args._id };
    }

    entity = await collection.findOne(query);
  }

  invariant(entity, errorMessage);

  return next(entity, args, context);
};
