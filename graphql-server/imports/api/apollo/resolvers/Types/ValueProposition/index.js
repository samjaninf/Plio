import { loadOrganizationById, loadUserById, lenses } from 'plio-util';
import { view } from 'ramda';

const {
  createdBy,
  updatedBy,
  originatorId,
  organizationId,
} = lenses;

export default {
  ValueProposition: {
    createdBy: loadUserById(view(createdBy)),
    updatedBy: loadUserById(view(updatedBy)),
    originator: loadUserById(view(originatorId)),
    organization: loadOrganizationById(view(organizationId)),
    matchedTo: async (root, args, context) => {
      const { documentId } = root.matchedTo || {};
      const { loaders: { CustomerSegment: { byId } } } = context;
      if (!documentId) return null;

      return byId.load(documentId);
    },
    benefits: async (root, args, context) => {
      const { _id } = root;
      const { loaders: { Benefit: { byQuery } } } = context;

      return byQuery.load({ 'linkedTo.documentId': _id });
    },
    features: async (root, args, context) => {
      const { _id } = root;
      const { loaders: { Feature: { byQuery } } } = context;

      return byQuery.load({ 'linkedTo.documentId': _id });
    },
  },
};
