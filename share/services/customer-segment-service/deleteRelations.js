import { pluck, concat } from 'ramda';

export default async function deleteCustomerSegmentCustomerElementRelations(args, context) {
  const { _id } = args;
  const { collections: { Needs, Wants, Relations } } = context;
  const query = { 'linkedTo.documentId': _id };
  const options = { fields: { _id: 1 } };
  const needs = await Needs.find(query, options).fetch();
  const wants = await Wants.find(query, options).fetch();
  const ids = pluck('_id', concat(needs, wants));

  await Relations.remove({
    $or: [
      { 'rel1.documentId': { $in: ids } },
      { 'rel2.documentId': { $in: ids } },
    ],
  });
}
