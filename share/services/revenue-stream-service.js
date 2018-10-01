export default {
  insert: async ({
    organizationId,
    title,
    originatorId,
    percentOfRevenue,
    percentOfProfit,
    color,
    notes,
  }, { userId, collections: { RevenueStreams } }) => RevenueStreams.insert({
    organizationId,
    title,
    originatorId,
    color,
    notes,
    percentOfRevenue,
    percentOfProfit,
    createdBy: userId,
  }),
  async update({
    _id,
    title,
    originatorId,
    color,
    percentOfRevenue,
    percentOfProfit,
    notes,
    fileIds,
  }, { userId, collections: { RevenueStreams } }) {
    const query = { _id };
    const modifier = {
      $set: {
        title,
        originatorId,
        color,
        percentOfRevenue,
        percentOfProfit,
        notes,
        fileIds,
        updatedBy: userId,
      },
    };

    return RevenueStreams.update(query, modifier);
  },
  async delete({ _id }, { collections: { RevenueStreams } }) {
    return RevenueStreams.remove({ _id });
  },
};
