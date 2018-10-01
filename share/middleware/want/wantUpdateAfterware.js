export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { collections: { Wants } } = context;

  await next(root, args, context);

  return Wants.findOne({ _id });
};
