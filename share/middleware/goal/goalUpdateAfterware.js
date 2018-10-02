export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { collections: { Goals } } = context;

  await next(root, args, context);

  const goal = await Goals.findOne({ _id });

  return goal;
};
