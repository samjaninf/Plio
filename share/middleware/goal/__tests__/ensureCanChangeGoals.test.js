import { Roles } from 'meteor/alanning:roles';
import { T } from 'ramda';

import ensureCanChangeGoals from '../ensureCanChangeGoals';
import { UserRoles } from '../../../../share/constants';
import Errors from '../../../errors';

describe('ensureCanChangeGoals', () => {
  it('throws', async () => {
    const root = {};
    const args = {};
    const context = {
      userId: null,
      doc: {},
    };
    const promise = ensureCanChangeGoals()(T, root, args, context);

    await expect(promise).rejects.toEqual(new Error(Errors.GOAL_CANNOT_CHANGE));
  });

  it('passes', async () => {
    const root = {};
    const args = {};
    const userId = 1;
    const organizationId = 2;
    const doc = { organizationId };
    const context = { userId, doc };

    Roles.addUsersToRoles(userId, [UserRoles.CREATE_DELETE_GOALS], organizationId);

    const promise = ensureCanChangeGoals()(T, root, args, context);

    await expect(promise).resolves.toBe(true);
  });
});
