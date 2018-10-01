import { CanvasTypes } from '../../constants';

export default async function unmatchCustomerSegment({ _id }, context) {
  const { collections: { ValuePropositions } } = context;
  return ValuePropositions.update(
    {
      matchedTo: {
        documentId: _id,
        documentType: CanvasTypes.CUSTOMER_SEGMENT,
      },
    },
    { $unset: { matchedTo: '' } },
    { multi: true },
  );
}
