export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { collections: { KeyResources } } = context;

  await next(root, args, context);

  return KeyResources.findOne({ _id });
};
