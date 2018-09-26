import { applyMiddleware } from 'plio-util';
import { checkLoggedIn, checkOrgMembership } from '../../../../../share/middleware';

export const resolver = async (
  root,
  { organizationId, isUnmatched = false },
  { collections: { ValuePropositions } },
) => {
  const query = { organizationId };

  if (isUnmatched) Object.assign(query, { matchedTo: null });

  const cursor = ValuePropositions.find(query);

  return {
    totalCount: cursor.count(),
    valuePropositions: cursor.fetch(),
  };
};

export default applyMiddleware(
  checkLoggedIn(),
  checkOrgMembership(),
)(resolver);
