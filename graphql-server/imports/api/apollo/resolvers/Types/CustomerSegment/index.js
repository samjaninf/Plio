import { loadOrganizationById, loadUserById, lenses } from 'plio-util';
import { view } from 'ramda';

const {
  createdBy,
  updatedBy,
  originatorId,
  organizationId,
} = lenses;

export default {
  CustomerSegment: {
    createdBy: loadUserById(view(createdBy)),
    updatedBy: loadUserById(view(updatedBy)),
    originator: loadUserById(view(originatorId)),
    organization: loadOrganizationById(view(organizationId)),
    matchedTo: async (root, args, context) => {
      const { matchedTo: { documentId } = {} } = root;
      const { loaders: { ValueProposition: { byId } } } = context;

      return byId.load(documentId);
    },
  },
};