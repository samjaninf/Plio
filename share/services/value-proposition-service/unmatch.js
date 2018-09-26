import { CanvasTypes } from '../../constants';

export default async function unmatchValueProposition({ _id }, context) {
  const { collections: { CustomerSegments } } = context;
  return CustomerSegments.update(
    {
      matchedTo: {
        documentId: _id,
        documentType: CanvasTypes.VALUE_PROPOSITION,
      },
    },
    { $unset: { matchedTo: '' } },
    { multi: true },
  );
}
