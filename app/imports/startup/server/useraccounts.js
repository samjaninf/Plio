import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { AccountsTemplates } from 'meteor/useraccounts:core';

import OrganizationService from '../../api/organizations/organization-service';
import { OrgOwnerRoles, HomeScreenTypes, DEFAULT_ORG_TIMEZONE } from '../../share/constants';
// eslint-disable-next-line camelcase
import { ORG_EnsureNameIsUnique } from '../../api/checkers';

function postSignUpHook(userId, {
  profile: {
    organizationName,
    organizationTimezone = DEFAULT_ORG_TIMEZONE,
    organizationHomeScreen = HomeScreenTypes.OPERATIONS,
  },
}) {
  let organizationId;
  try {
    ORG_EnsureNameIsUnique({ name: organizationName });

    organizationId = OrganizationService.insert({
      name: organizationName,
      timezone: organizationTimezone,
      homeScreenType: organizationHomeScreen,
      ownerId: userId,
    });
  } catch (err) {
    Meteor.users.remove({ _id: userId });
    throw err;
  }

  Roles.addUsersToRoles(userId, OrgOwnerRoles, organizationId);

  Meteor.users.update({
    _id: userId,
  }, {
    $unset: {
      'profile.organizationName': '',
      'profile.organizationHomeScreen': '',
      'profile.organizationTimezone': '',
    },
  });
}

AccountsTemplates.configure({
  postSignUpHook,
});
