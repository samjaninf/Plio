export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { collections: { Standards } } = context;

  await next(root, args, context);

  return Standards.findOne({ _id });
};
