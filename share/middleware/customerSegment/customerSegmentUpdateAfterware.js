export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { collections: { CustomerSegments } } = context;

  await next(root, args, context);

  return CustomerSegments.findOne({ _id });
};
