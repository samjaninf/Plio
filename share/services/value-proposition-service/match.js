import { CanvasTypes } from '../../constants';
import deleteRelations from './deleteRelations';
import unmatch from './unmatch';

export default async function matchValueProposition(args, context) {
  const { _id, matchedTo } = args;
  const { collections: { ValuePropositions, CustomerSegments } } = context;
  const query = { _id };
  const modifier = {
    $set: { matchedTo },
  };

  const res = await ValuePropositions.update(query, modifier);

  await deleteRelations({ _id }, context);
  await unmatch({ _id }, context);

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

  return res;
}
