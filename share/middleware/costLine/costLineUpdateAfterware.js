export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { collections: { CostLines } } = context;

  await next(root, args, context);

  return CostLines.findOne({ _id });
};
