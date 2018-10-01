import { loadOrganizationById, loadUserById, lenses, generateSequentialId } from 'plio-util';
import { view } from 'ramda';

import { Abbreviations, CustomerElementTypes } from '../../../../../share/constants';
import { resolveCustomerElementStatus, resolveMatchedNeeds, resolveMatchedWants } from '../util';

const {
  createdBy,
  updatedBy,
  organizationId,
} = lenses;

export default {
  Benefit: {
    createdBy: loadUserById(view(createdBy)),
    updatedBy: loadUserById(view(updatedBy)),
    organization: loadOrganizationById(view(organizationId)),
    sequentialId: generateSequentialId(Abbreviations.BENEFIT),
    documentType: () => CustomerElementTypes.BENEFIT,
    status: resolveCustomerElementStatus,
    needs: resolveMatchedNeeds,
    wants: resolveMatchedWants,
  },
};
