import {
  loadUserById,
  loadUsersById,
  loadOrganizationById,
  loadFilesById,
  lenses,
  loadDepartmentsById,
} from 'plio-util';
import { view } from 'ramda';

const {
  createdBy,
  updatedBy,
  owner,
  deletedBy,
  notify,
  organizationId,
  fileIds,
  departmentsIds,
} = lenses;

export default {
  Standard: {
    createdBy: loadUserById(view(createdBy)),
    updatedBy: loadUserById(view(updatedBy)),
    owner: loadUserById(view(owner)),
    deletedBy: loadUserById(view(deletedBy)),
    notify: loadUsersById(view(notify)),
    organization: loadOrganizationById(view(organizationId)),
    files: loadFilesById(view(fileIds)),
    departments: loadDepartmentsById(view(departmentsIds)),
    type: async (root, args, context) => {
      const { typeId } = root;
      const { loaders: { StandardType: { byId } } } = context;
      if (!typeId) return null;

      return byId.load(typeId);
    },
    section: async (root, args, context) => {
      const { sectionId } = root;
      const { loaders: { StandardSection: { byId } } } = context;
      if (!sectionId) return null;

      return byId.load(sectionId);
    },
  },
};
