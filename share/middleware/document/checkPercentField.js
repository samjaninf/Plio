import { compose, sum, map, prop } from 'ramda';
import invariant from 'invariant';

import { MAX_TOTAL_PERCENT } from '../../constants';

const calculateTotalPercent = (key, items) => compose(sum, map(prop(key)))(items);

export default (config = () => ({})) => async (next, root, args, context) => {
  const {
    key,
    collection,
    entityName,
    query = { organizationId: args.organizationId },
  } = await config(root, args, context);

  invariant(
    key || collection || entityName,
    'collection, key or entityName is required',
  );

  const { [key]: percent = 0 } = root || {};
  const { [key]: newPercent = 0 } = args;

  const percentDiff = newPercent - percent;
  if (percentDiff <= 0) return next(root, args, context);

  const items = await collection.find(
    query,
    { fields: { [key]: 1 } },
  ).fetch();

  const totalPercent = calculateTotalPercent(key, items);
  const isNotExceeded = totalPercent + percentDiff <= MAX_TOTAL_PERCENT;

  invariant(
    isNotExceeded,
    `${entityName} cannot add up to more than 100%.\nPlease reduce one or more values.`,
  );

  return next(root, args, context);
};
