export default {
  insert: async ({
    organizationId,
    title,
    originatorId,
    color,
    notes,
  }, { userId, collections: { Channels } }) => Channels.insert({
    organizationId,
    title,
    originatorId,
    color,
    notes,
    createdBy: userId,
  }),
  async update({
    _id,
    title,
    originatorId,
    color,
    notes,
    fileIds,
  }, { userId, collections: { Channels } }) {
    const query = { _id };
    const modifier = {
      $set: {
        title,
        originatorId,
        color,
        notes,
        fileIds,
        updatedBy: userId,
      },
    };

    return Channels.update(query, modifier);
  },
  async delete({ _id }, { collections: { Channels } }) {
    return Channels.remove({ _id });
  },
};
