import { curry } from 'ramda';
import { checkDocExistance } from '../../checkers';

export default curry((getQuery, collection) => (next, root, args, context) => {
  const doc = checkDocExistance(collection, getQuery(args, context));
  return next(root || doc, args, { ...context, doc });
});
