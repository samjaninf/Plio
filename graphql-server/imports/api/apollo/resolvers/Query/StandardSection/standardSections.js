import { applyMiddleware } from 'plio-util';
import { checkLoggedIn, checkOrgMembership } from '../../../../../share/middleware';

export const resolver = async (
  root,
  { organizationId },
  { collections: { StandardsBookSections } },
) => {
  const cursor = StandardsBookSections.find({ organizationId });

  return {
    totalCount: cursor.count(),
    standardSections: cursor.fetch(),
  };
};

export default applyMiddleware(
  checkLoggedIn(),
  checkOrgMembership(),
)(resolver);
