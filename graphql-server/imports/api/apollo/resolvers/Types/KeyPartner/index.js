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
    goals: async (root, args, context) => {
      const { goalIds = [] } = root;
      const { loaders: { Goal: { byQuery } } } = context;

      return byQuery.loadMany(map(goalId => ({
        _id: goalId,
        isDeleted: false,
      }), goalIds)).then(flatten);
    },
    standards: async (root, args, context) => {
      const { standardIds = [] } = root;
      const { loaders: { Standard: { byQuery } } } = context;

      return byQuery.loadMany(map(standardId => ({
        _id: standardId,
        isDeleted: false,
      }), standardIds)).then(flatten);
    },
    risks: async (root, args, context) => {
      const { riskIds = [] } = root;
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
