export default {
  insert: async ({ rel1, rel2 }, { userId, collections: { Relations } }) => Relations.insert({
    rel1,
    rel2,
    createdBy: userId,
  }),

  delete: async ({ rel1, rel2 }, { collections: { Relations } }) => Relations.remove({
    $or: [
      {
        'rel1.documentId': rel1.documentId,
        'rel2.documentId': rel2.documentId,
      },
      {
        'rel1.documentId': rel2.documentId,
        'rel2.documentId': rel1.documentId,
      },
    ],
  }),

  deleteByDocumentId: async ({ documentId }, { collections: { Relations } }) => Relations.remove({
    $or: [
      { 'rel1.documentId': documentId },
      { 'rel2.documentId': documentId },
    ],
  }),
};
