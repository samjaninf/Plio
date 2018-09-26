import invariant from 'invariant';

import { CustomerElementStatuses, CustomerElementTypes } from '../../../../share/constants';

export const createRelationResolver = config => async (root, args, context) => {
  const { documentType, loader } = await config(root, args, context);

  invariant(documentType && loader, 'Your config function must return "documentType" and "loader"');

  const { _id } = root;
  const { loaders: { Relation } } = context;
  const relations = await Relation.byQuery.load({
    $or: [
      {
        'rel1.documentId': _id,
        'rel2.documentType': documentType,
      },
      {
        'rel2.documentId': _id,
        'rel1.documentType': documentType,
      },
    ],
  });

  const ids = relations.map((rel) => {
    if (rel.rel1.documentType === documentType) {
      return rel.rel1.documentId;
    }

    return rel.rel2.documentId;
  });

  return loader.loadMany(ids);
};

export const resolveMatchedBenefits = createRelationResolver(
  (root, args, { loaders: { Benefit: { byId } } }) => ({
    documentType: CustomerElementTypes.BENEFIT,
    loader: byId,
  }),
);

export const resolveMatchedFeatures = createRelationResolver(
  (root, args, { loaders: { Feature: { byId } } }) => ({
    documentType: CustomerElementTypes.FEATURE,
    loader: byId,
  }),
);

export const resolveMatchedNeeds = createRelationResolver(
  (root, args, { loaders: { Need: { byId } } }) => ({
    documentType: CustomerElementTypes.NEED,
    loader: byId,
  }),
);

export const resolveMatchedWants = createRelationResolver(
  (root, args, { loaders: { Want: { byId } } }) => ({
    documentType: CustomerElementTypes.WANT,
    loader: byId,
  }),
);


export const resolveCustomerElementStatus = async (root, args, context) => {
  const { _id } = root;
  const { loaders: { Relation: { byQuery } } } = context;
  // TODO: We don't need to load all of the relations, just one.
  const relations = await byQuery.load({
    $or: [
      { 'rel1.documentId': _id },
      { 'rel2.documentId': _id },
    ],
  });
  const isMatched = !!relations.length;

  return isMatched ? CustomerElementStatuses.MATCHED : CustomerElementStatuses.UNMATCHED;
};
