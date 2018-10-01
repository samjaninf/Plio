import { CanvasTypes } from '../../constants';

export default async function insertValueProposition({
  organizationId,
  title,
  originatorId,
  matchedTo,
  color,
  notes,
}, { userId, collections: { ValuePropositions, CustomerSegments } }) {
  const _id = await ValuePropositions.insert({
    organizationId,
    title,
    originatorId,
    color,
    notes,
    matchedTo,
    createdBy: userId,
  });

  if (matchedTo) {
    await CustomerSegments.update({ _id: matchedTo.documentId }, {
      $set: {
        matchedTo: {
          documentId: _id,
          documentType: CanvasTypes.VALUE_PROPOSITION,
        },
      },
    });
  }

  return _id;
}
