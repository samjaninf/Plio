export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { collections: { ValuePropositions } } = context;

  await next(root, args, context);

  return ValuePropositions.findOne({ _id });
};
