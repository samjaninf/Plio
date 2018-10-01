export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { collections: { Channels } } = context;

  await next(root, args, context);

  return Channels.findOne({ _id });
};
