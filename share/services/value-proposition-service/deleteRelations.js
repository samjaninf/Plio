import { pluck, concat } from 'ramda';

export default async function deleteValuePropositionCustomerElementRelations(args, context) {
  const { _id } = args;
  const { collections: { Benefits, Features, Relations } } = context;
  const query = { 'linkedTo.documentId': _id };
  const options = { fields: { _id: 1 } };
  const benefits = await Benefits.find(query, options).fetch();
  const features = await Features.find(query, options).fetch();
  const ids = pluck('_id', concat(benefits, features));
  await Relations.remove({
    $or: [
      { 'rel1.documentId': { $in: ids } },
      { 'rel2.documentId': { $in: ids } },
    ],
  });
}
