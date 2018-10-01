import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { UserRoles } from '../../../share/constants.js';

export default {
  canInviteUsers(organizationId) {
    const userId = Meteor.userId();

    if (userId && organizationId) {
      return Roles.userIsInRole(
        userId,
        UserRoles.INVITE_USERS,
        organizationId,
      );
    }
    return false;
  },
  canCreateAndEditStandards(organizationId) {
    const userId = Meteor.userId();

    if (userId && organizationId) {
      return Roles.userIsInRole(
        userId,
        UserRoles.CREATE_UPDATE_DELETE_STANDARDS,
        organizationId,
      );
    }
    return false;
  },
};
