export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { collections: { KeyActivities } } = context;

  await next(root, args, context);

  return KeyActivities.findOne({ _id });
};
