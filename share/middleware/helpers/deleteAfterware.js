import invariant from 'invariant';

export default (config = () => ({})) => async (next, root, args, context) => {
  const { _id } = args;
  const {
    collection,
    query = { _id },
  } = await config(root, args, context);

  invariant(collection, 'collection is required');

  const doc = collection.findOne(query);
  await next(root, args, context);

  return doc;
};
