import { CanvasTypes } from '../../constants';

export default async function insertCustomerSegment({
  organizationId,
  title,
  originatorId,
  matchedTo,
  percentOfMarketSize,
  color,
  notes,
}, { userId, collections: { CustomerSegments, ValuePropositions } }) {
  const _id = await CustomerSegments.insert({
    organizationId,
    title,
    originatorId,
    color,
    notes,
    percentOfMarketSize,
    matchedTo,
    createdBy: userId,
  });

  if (matchedTo) {
    await ValuePropositions.update({ _id: matchedTo.documentId }, {
      $set: {
        matchedTo: {
          documentId: _id,
          documentType: CanvasTypes.CUSTOMER_SEGMENT,
        },
      },
    });
  }

  return _id;
}
