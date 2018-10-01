import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';

import {
  Organizations,
  StandardTypes,
  StandardsBookSections,
  RiskTypes,
  Departments,
} from '../../../share/collections';
import { getUserOrganizations } from '../utils';
import { isPlioUser, isOrgMember } from '../../checkers';
import { createOrgQueryWhereUserIsOwner } from '../../../share/mongo/queries';
import { WORKSPACE_DEFAULTS } from '../../../share/constants';

Meteor.publish('invitationInfo', function (invitationId) {
  check(invitationId, String);

  const sendInternalError = message => this.error(new Meteor.Error(500, message));

  if (!SimpleSchema.RegEx.Id.test(invitationId)) {
    sendInternalError('Incorrect invitation ID!');
    return this.ready();
  }

  const invitedUserCursor = Meteor.users.find({
    invitationId,
  }, {
    fields: { emails: 1, invitationId: 1, invitationOrgId: 1 },
  });

  if (invitedUserCursor.count() === 0) {
    sendInternalError('Invitation do not exist');
    return this.ready();
  }

  const { _id: invitedUserId, invitationOrgId } = invitedUserCursor.fetch()[0];

  return [
    invitedUserCursor,
    Organizations.find({
      _id: invitationOrgId,
      'users.userId': invitedUserId,
    }, {
      limit: 1,
      fields: {
        name: 1,
        serialNumber: 1,
        homeScreenType: 1,
      },
    }),
  ];
});

Meteor.publish('currentUserOrganizations', function () {
  if (this.userId) {
    return getUserOrganizations(this.userId, {}, {
      fields: {
        name: 1,
        serialNumber: 1,
        homeScreenType: 1,
        'users.userId': 1,
        'users.role': 1,
        'users.isRemoved': 1,
        'users.removedAt': 1,
        'users.removedBy': 1,
        'users.sendDailyRecap': 1,
      },
    });
  }

  return this.ready();
});

Meteor.publish('currentUserOrganizationBySerialNumber', function (serialNumber) {
  check(serialNumber, Number);

  const fields = {
    _id: 1,
    name: 1,
    serialNumber: 1,
    users: 1,
    timezone: 1,
    currency: 1,
    workflowDefaults: 1,
    reminders: 1,
    ncGuidelines: 1,
    pgGuidelines: 1,
    rkGuidelines: 1,
    rkScoringGuidelines: 1,
    review: 1,
    homeScreenTitles: 1,
    isAdminOrg: 1,
    createdAt: 1,
    createdBy: 1,
    updatedAt: 1,
    updatedBy: 1,
    lastAccessedDate: 1,
    transfer: 1,
    homeScreenType: 1,
    [WORKSPACE_DEFAULTS]: 1,
  };

  if (this.userId) {
    return getUserOrganizations(this.userId, { serialNumber }, { fields });
  }

  return this.ready();
});

Meteor.publish('dataImportUserOwnOrganizations', function publishDataImportUserOwnOrgs() {
  const { userId } = this;

  if (!userId) return this.ready();

  const query = createOrgQueryWhereUserIsOwner(userId);
  const fields = {
    _id: 1,
    name: 1,
    ...query,
  };
  const options = { fields };

  return Organizations.find(query, options);
});

Meteor.publish('transferredOrganization', function (transferId) {
  check(transferId, String);

  const { userId } = this;
  const organizationCursor = Organizations.find({
    'transfer._id': transferId,
  });
  const organization = organizationCursor.fetch()[0];

  if (userId && organization) {
    if (organization.transfer && organization.transfer.newOwnerId === userId) {
      return organizationCursor;
    }
    const error = new Meteor.Error(
      403,
      'Your account is not authorized for this action. Sign out and login as a proper user',
    );

    this.error(error);

    return this.ready();
  }
  const error = new Meteor.Error(404, 'An invitation to transfer the organization is not found');

  this.error(error);

  return this.ready();
});

Meteor.publish('organizationDeps', function (organizationId) {
  check(organizationId, String);

  const { userId } = this;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  const organization = Organizations.findOne({ _id: organizationId });
  const userIds = _.pluck(organization.users, 'userId');

  const query = { organizationId };

  const standardsBookSections = StandardsBookSections.find(query, {
    fields: StandardsBookSections.publicFields,
  });
  const standardsTypes = StandardTypes.find(query, { fields: StandardTypes.publicFields });
  const riskTypes = RiskTypes.find(query);
  const departments = Departments.find(query, { fields: Departments.publicFields });
  const users = Meteor.users.find({ _id: { $in: userIds } }, {
    fields: Meteor.users.publicFields,
  });

  return [
    standardsBookSections,
    standardsTypes,
    riskTypes,
    departments,
    users,
  ];
});

Meteor.publishComposite('customersLayout', {
  find() {
    if (!this.userId || !isPlioUser(this.userId)) {
      return this.ready();
    }

    return Organizations.find({}, {
      fields: Organizations.listFields,
    });
  },
  children: [{
    find(organization) {
      return Meteor.users.find({
        _id: organization.ownerId(),
      }, {
        fields: {
          'emails.address': 1,
          'profile.firstName': 1,
          'profile.lastName': 1,
        },
      });
    },
  }],
});

Meteor.publish('customerCard', function getCustomerData(organizationId) {
  check(organizationId, String);

  if (!this.userId || !isPlioUser(this.userId)) {
    return this.ready();
  }

  return Organizations.find({ _id: organizationId }, {
    fields: Organizations.cardFields,
  });
});
