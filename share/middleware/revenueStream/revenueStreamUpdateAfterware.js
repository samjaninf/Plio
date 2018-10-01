export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { collections: { RevenueStreams } } = context;

  await next(root, args, context);

  return RevenueStreams.findOne({ _id });
};
