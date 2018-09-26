import { loadOrganizationById, loadUserById, lenses } from 'plio-util';
import { view, map, flatten } from 'ramda';

const {
  createdBy,
  updatedBy,
  originatorId,
  organizationId,
} = lenses;

export default {
  KeyPartner: {
    createdBy: loadUserById(view(createdBy)),
    updatedBy: loadUserById(view(updatedBy)),
    originator: loadUserById(view(originatorId)),
    organization: loadOrganizationById(view(organizationId)),
    risks: async (root, args, context) => {
      const { riskIds } = root;
      const { loaders: { Risk: { byQuery } } } = context;

      return byQuery.loadMany(map(riskId => ({
        _id: riskId,
        isDeleted: false,
      }), riskIds)).then(flatten);
    },
    lessons: async (root, args, context) => {
      const { _id: documentId } = root;
      const { loaders: { Lesson: { byQuery } } } = context;

      return byQuery.load({ documentId });
    },
  },
};
