export default {
  async insert({
    organizationId,
    title,
    originatorId,
    color,
    notes,
  }, { userId, collections: { KeyActivities } }) {
    return KeyActivities.insert({
      organizationId,
      title,
      originatorId,
      color,
      notes,
      createdBy: userId,
    });
  },
  async update({
    _id,
    title,
    originatorId,
    color,
    notes,
    fileIds,
  }, { userId, collections: { KeyActivities } }) {
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

    return KeyActivities.update(query, modifier);
  },
  async delete({ _id }, { collections: { KeyActivities } }) {
    return KeyActivities.remove({ _id });
  },
};
