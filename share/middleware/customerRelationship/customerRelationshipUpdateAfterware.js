export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { collections: { CustomerRelationships } } = context;

  await next(root, args, context);

  return CustomerRelationships.findOne({ _id });
};
