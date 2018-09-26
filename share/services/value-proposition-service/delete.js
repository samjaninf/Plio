import unmatch from './unmatch';
import deleteRelations from './deleteRelations';

export default async function deleteValueProposition(args, context) {
  const { _id } = args;
  const query = { 'linkedTo.documentId': _id };
  const { collections: { ValuePropositions, Benefits, Features } } = context;

  const res = await ValuePropositions.remove({ _id });
  await unmatch(args, context);
  await deleteRelations(args, context);
  await Benefits.remove(query);
  await Features.remove(query);

  return res;
}
