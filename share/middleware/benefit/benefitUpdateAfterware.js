export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { collections: { Benefits } } = context;

  await next(root, args, context);

  return Benefits.findOne({ _id });
};
