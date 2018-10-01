export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { collections: { Needs } } = context;

  await next(root, args, context);

  return Needs.findOne({ _id });
};
