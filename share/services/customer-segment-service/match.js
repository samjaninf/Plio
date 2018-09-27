import { CanvasTypes } from '../../constants';
import deleteRelations from './deleteRelations';
import unmatch from './unmatch';

export default async function matchCustomerSegment(args, context) {
  const { _id, matchedTo } = args;
  const { collections: { CustomerSegments, ValuePropositions } } = context;
  const query = { _id };
  const modifier = {
    $set: { matchedTo },
  };

  const res = await CustomerSegments.update(query, modifier);

  await deleteRelations({ _id }, context);
  await unmatch({ _id }, context);

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

  return res;
}
