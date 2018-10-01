import { GraphQLTypenames } from '../../../api/constants';
import updateFragmentCache from './updateFragmentCache';

export const updateOrganizationFragment = updateFragmentCache(GraphQLTypenames.ORGANIZATION);
