import { applyMiddleware } from 'plio-util';
import { checkLoggedIn, checkOrgMembership } from '../../../../../share/middleware';

export const resolver = async (
  root,
  { organizationId, isUnmatched = false },
  { collections: { CustomerSegments } },
) => {
  const query = { organizationId };

  if (isUnmatched) Object.assign(query, { matchedTo: null });

  const cursor = CustomerSegments.find(query);

  return {
    totalCount: cursor.count(),
    customerSegments: cursor.fetch(),
  };
};

export default applyMiddleware(
  checkLoggedIn(),
  checkOrgMembership(),
)(resolver);
