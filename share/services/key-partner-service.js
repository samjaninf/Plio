export default {
  async insert({
    organizationId,
    title,
    originatorId,
    color,
    criticality,
    levelOfSpend,
    notes,
  }, { userId, collections: { KeyPartners } }) {
    return KeyPartners.insert({
      organizationId,
      title,
      originatorId,
      color,
      criticality,
      levelOfSpend,
      notes,
      createdBy: userId,
    });
  },
  async update({
    _id,
    title,
    originatorId,
    color,
    criticality,
    levelOfSpend,
    notes,
    fileIds,
  }, { userId, collections: { KeyPartners } }) {
    const query = { _id };
    const modifier = {
      $set: {
        title,
        originatorId,
        color,
        criticality,
        levelOfSpend,
        notes,
        fileIds,
        updatedBy: userId,
      },
    };

    return KeyPartners.update(query, modifier);
  },
  async delete({ _id }, { collections: { KeyPartners } }) {
    return KeyPartners.remove({ _id });
  },
};
