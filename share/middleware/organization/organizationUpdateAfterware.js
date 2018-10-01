export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { collections: { Organizations } } = context;

  await next(root, args, context);

  return Organizations.findOne({ _id });
};
