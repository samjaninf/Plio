import unmatch from './unmatch';
import deleteRelations from './deleteRelations';

export default async function deleteCustomerSegment(args, context) {
  const { _id } = args;
  const { collections: { CustomerSegments, Needs, Wants } } = context;

  const res = await CustomerSegments.remove({ _id });
  await unmatch(args, context);
  await deleteRelations(args, context);
  await Needs.remove({ 'linkedTo.documentId': _id });
  await Wants.remove({ 'linkedTo.documentId': _id });

  return res;
}
