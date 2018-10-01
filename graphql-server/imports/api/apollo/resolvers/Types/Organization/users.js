import {
  lenses,
  getUserIds,
  eqUserId,
  isRemoved,
  getUser,
  getId,
} from 'plio-util';
import {
  anyPass,
  complement,
  map,
  converge,
  set,
  curry,
  reject,
  identity,
  find,
} from 'ramda';

const isRemovedOrNoUser = anyPass([isRemoved, complement(getUser)]);
const findOrgUser = curry((users, user) => find(eqUserId(getId(user)), users));

export default async ({ users: orgUsers }, args, { loaders: { User: { byQuery } } }) => {
  const userIds = getUserIds(orgUsers);
  return byQuery.load({
    _id: { $in: userIds },
    invitationId: null,
    'emails.verified': true,
  }).then(map(converge(set(lenses.user), [
    identity,
    findOrgUser(orgUsers),
  ])))
    .then(reject(isRemovedOrNoUser));
};
