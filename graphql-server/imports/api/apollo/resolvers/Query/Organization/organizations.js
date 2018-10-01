import { applyMiddleware } from 'plio-util';

import { createOrgQueryWhereUserIsMember } from '../../../../../share/mongo';
import { checkLoggedIn } from '../../../../../share/middleware';

export const resolver = async (
  root,
  vars,
  { collections: { Organizations }, userId },
) => {
  const cursor = Organizations.find(createOrgQueryWhereUserIsMember(userId));

  return {
    totalCount: cursor.count(),
    organizations: cursor.fetch(),
  };
};

export default applyMiddleware(
  checkLoggedIn(),
)(resolver);
