import { loadOrganizationById, loadUserById, lenses, generateSequentialId } from 'plio-util';
import { view } from 'ramda';

import { Abbreviations, CustomerElementTypes } from '../../../../../share/constants';
import {
  resolveCustomerElementStatus,
  resolveMatchedBenefits,
  resolveMatchedFeatures,
} from '../util';

const {
  createdBy,
  updatedBy,
  organizationId,
} = lenses;

export default {
  Want: {
    createdBy: loadUserById(view(createdBy)),
    updatedBy: loadUserById(view(updatedBy)),
    organization: loadOrganizationById(view(organizationId)),
    sequentialId: generateSequentialId(Abbreviations.WANT),
    documentType: () => CustomerElementTypes.WANT,
    status: resolveCustomerElementStatus,
    benefits: resolveMatchedBenefits,
    features: resolveMatchedFeatures,
  },
};
