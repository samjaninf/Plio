export default async function updateCustomerSegment(args, context) {
  const {
    _id,
    title,
    originatorId,
    color,
    percentOfMarketSize,
    notes,
    fileIds,
  } = args;
  const { userId, collections: { CustomerSegments } } = context;
  const query = { _id };
  const modifier = {
    $set: {
      title,
      originatorId,
      color,
      percentOfMarketSize,
      notes,
      fileIds,
      updatedBy: userId,
    },
  };

  return CustomerSegments.update(query, modifier);
}
