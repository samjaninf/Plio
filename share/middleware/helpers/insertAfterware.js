import invariant from 'invariant';

export default (config = () => ({})) => async (next, root, args, context) => {
  const { collection, key } = await config(root, args, context);

  invariant(collection, 'collection is required');

  const _id = await next(root, args, context);
  const doc = await collection.findOne({ _id });
  return key ? { [key]: doc } : doc;
};
