import { applyMiddleware } from 'plio-util';
import { checkLoggedIn, checkOrgMembership } from '../../../../../share/middleware';

export const resolver = async (root, { organizationId }, { collections: { StandardTypes } }) => {
  const cursor = StandardTypes.find({ organizationId });

  return {
    totalCount: cursor.count(),
    standardTypes: cursor.fetch(),
  };
};

export default applyMiddleware(
  checkLoggedIn(),
  checkOrgMembership(),
)(resolver);
