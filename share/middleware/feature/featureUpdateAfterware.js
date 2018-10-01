export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { collections: { Features } } = context;

  await next(root, args, context);

  return Features.findOne({ _id });
};
