export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { collections: { Milestones } } = context;

  await next(root, args, context);

  const milestone = await Milestones.findOne({ _id });

  return milestone;
};
