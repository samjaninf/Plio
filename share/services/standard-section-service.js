export default {
  async insert(
    { organizationId, title },
    { userId, collections: { StandardsBookSections } },
  ) {
    return StandardsBookSections.insert({
      organizationId,
      title,
      createdBy: userId,
    });
  },
};
