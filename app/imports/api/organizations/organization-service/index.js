import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Random } from 'meteor/random';
import { _ } from 'meteor/underscore';

import StandardsBookSectionService from
  '../../standards-book-sections/standards-book-section-service';
import StandardsTypeService from '../../standards-types/standards-type-service';
import RisksTypeService from '../../risk-types/risk-types-service';
import {
  DefaultStandardSections,
  DefaultStandardTypes,
  DefaultRiskTypes,
  OrganizationDefaults,
  OrgOwnerRoles,
  OrgMemberRoles,
  UserMembership,
  UserRoles,
} from '../../../share/constants';
import { generateSerialNumber } from '../../../share/helpers';
import OrgNotificationsSender from '../org-notifications-sender';
import importDocuments from './importDocuments';
import {
  Organizations,
  Actions,
  AuditLogs,
  Departments,
  Discussions,
  Files,
  LessonsLearned,
  Messages,
  NonConformities,
  Occurrences,
  RiskTypes,
  Risks,
  StandardsBookSections,
  StandardTypes,
  Standards,
  WorkItems,
  Goals,
  Milestones,
  CanvasSettings,
} from '../../../share/collections';

const OrganizationService = {
  importDocuments,

  collection: Organizations,

  insert({
    name,
    timezone,
    currency,
    ownerId,
    homeScreenType,
  }) {
    const serialNumber = generateSerialNumber(this.collection, {}, 100);

    const {
      workflowDefaults,
      reminders,
      ncGuidelines,
      pgGuidelines,
      rkGuidelines,
      rkScoringGuidelines,
      review,
    } = OrganizationDefaults;

    const organizationId = this.collection.insert({
      name,
      timezone,
      currency,
      serialNumber,
      homeScreenType,
      users: [{
        userId: ownerId,
        role: UserMembership.ORG_OWNER,
      }],
      workflowDefaults,
      reminders,
      ncGuidelines,
      pgGuidelines,
      rkGuidelines,
      rkScoringGuidelines,
      review,
      createdBy: ownerId,
    });

    _.each(DefaultStandardSections, ({ title }) => {
      StandardsBookSectionService.insert({
        title,
        organizationId,
        createdBy: ownerId,
      });
    });

    _.each(Object.values(DefaultStandardTypes), ({ title, abbreviation }) => {
      StandardsTypeService.insert({
        title,
        abbreviation,
        organizationId,
        createdBy: ownerId,
        isDefault: true,
      });
    });

    _.each(DefaultRiskTypes, ({ title }) => {
      RisksTypeService.insert({
        title,
        organizationId,
        createdBy: ownerId,
      });
    });

    Roles.addUsersToRoles(ownerId, OrgOwnerRoles, organizationId);

    new OrgNotificationsSender(organizationId).orgCreated();

    CanvasSettings.insert({ organizationId });

    return organizationId;
  },

  remove() {

  },

  setName({ _id, name }) {
    return this.collection.update({ _id }, {
      $set: { name },
    });
  },

  setTimezone({ _id, timezone }) {
    return this.collection.update({ _id }, {
      $set: { timezone },
    });
  },

  setDefaultCurrency({ _id, currency }) {
    return this.collection.update({ _id }, {
      $set: { currency },
    });
  },

  setWorkflowDefaults({ _id, type, ...args }) {
    const $set = {};

    Object.keys(args).forEach((key) => {
      if (type) $set[`workflowDefaults.${type}.${key}`] = args[key];
      else $set[`workflowDefaults.${key}`] = args[key];
    });

    return this.collection.update({ _id }, { $set });
  },

  setReminder({
    _id, type, reminderType, timeValue, timeUnit,
  }) {
    return this.collection.update({ _id }, {
      $set: {
        [`reminders.${type}.${reminderType}`]: { timeValue, timeUnit },
      },
    });
  },

  setReviewReviewerId({ _id, documentKey, reviewerId }) {
    const query = { _id };
    const modifier = {
      $set: {
        [`review.${documentKey}.reviewerId`]: reviewerId,
      },
    };

    return this.collection.update(query, modifier);
  },

  setReviewFrequency({ _id, documentKey, frequency }) {
    return this.collection.update({ _id }, {
      $set: {
        [`review.${documentKey}.frequency`]: frequency,
      },
    });
  },

  setReviewAnnualDate({ _id, documentKey, annualDate }) {
    return this.collection.update({ _id }, {
      $set: {
        [`review.${documentKey}.annualDate`]: annualDate,
      },
    });
  },

  setReviewReminderTimeValue({
    _id, documentKey, reminderType, timeValue,
  }) {
    return this.collection.update({ _id }, {
      $set: {
        [`review.${documentKey}.reminders.${reminderType}.timeValue`]: timeValue,
      },
    });
  },

  setReviewReminderTimeUnit({
    _id, documentKey, reminderType, timeUnit,
  }) {
    return this.collection.update({ _id }, {
      $set: {
        [`review.${documentKey}.reminders.${reminderType}.timeUnit`]: timeUnit,
      },
    });
  },

  setNCGuideline({ _id, type, text }) {
    return this.collection.update({ _id }, {
      $set: {
        [`ncGuidelines.${type}`]: text,
      },
    });
  },

  setPGGuideline({ _id, type, text }) {
    return this.collection.update({ _id }, {
      $set: {
        [`pgGuidelines.${type}`]: text,
      },
    });
  },

  setRKGuideline({ _id, type, text }) {
    const query = { _id };
    const options = {
      $set: {
        [`rkGuidelines.${type}`]: text,
      },
    };
    return this.collection.update(query, options);
  },

  setRKScoringGuidelines({ _id, rkScoringGuidelines }) {
    const query = { _id };
    const options = { $set: { rkScoringGuidelines } };
    return this.collection.update(query, options);
  },

  removeUser({ userId, organizationId, removedBy }) {
    Roles.removeUsersFromRoles(userId, _.values(UserRoles), organizationId);

    const ret = this.collection.update({
      _id: organizationId,
      'users.userId': userId,
    }, {
      $set: {
        'users.$.isRemoved': true,
        'users.$.removedBy': removedBy,
        'users.$.removedAt': new Date(),
      },
    });

    if (Meteor.isServer) {
      Meteor.defer(() => new OrgNotificationsSender(organizationId).userRemoved(userId, removedBy));
    }

    return ret;
  },

  createTransfer({ organizationId, newOwnerId, currOwnerId }) {
    const transferId = Random.id();

    this.collection.update({
      _id: organizationId,
    }, {
      $set: {
        transfer: {
          newOwnerId,
          _id: transferId,
          createdAt: new Date(),
        },
      },
    });

    if (Meteor.isServer) {
      Meteor.defer(() => new OrgNotificationsSender(organizationId)
        .transferCreated(newOwnerId, transferId, currOwnerId));
    }
  },

  transfer({ newOwnerId }, organization) {
    const organizationId = organization._id;
    const currOwnerId = organization.ownerId();

    this.collection.update({
      _id: organizationId,
      'users.userId': newOwnerId,
    }, {
      $set: {
        'users.$.role': UserMembership.ORG_OWNER,
      },
    });

    Roles.removeUsersFromRoles(currOwnerId, OrgMemberRoles, organizationId);
    Roles.addUsersToRoles(newOwnerId, OrgOwnerRoles, organizationId);

    this.collection.update({
      _id: organizationId,
      'users.userId': currOwnerId,
    }, {
      $set: {
        'users.$.role': UserMembership.ORG_MEMBER,
      },
    });

    Roles.removeUsersFromRoles(currOwnerId, OrgOwnerRoles, organizationId);
    Roles.addUsersToRoles(currOwnerId, OrgMemberRoles, organizationId);

    this.collection.update({
      _id: organizationId,
    }, {
      $unset: { transfer: '' },
    });

    if (Meteor.isServer) {
      Meteor.defer(() => new OrgNotificationsSender(organizationId)
        .transferCompleted(newOwnerId, currOwnerId));
    }
  },

  cancelTransfer({ organizationId }) {
    return this.collection.update({
      _id: organizationId,
    }, {
      $unset: { transfer: '' },
    });
  },

  updateUserSettings({ organizationId, userId, ...args }) {
    const modifier = {};
    _(args).each((val, key) => {
      _(modifier).extend({ [`users.$.${key}`]: val });
    });

    return this.collection.update({
      _id: organizationId,
      'users.userId': userId,
    }, {
      $set: { ...modifier },
    });
  },

  setTitleValue({ organizationId, fieldName, fieldValue }) {
    return this.collection.update({
      _id: organizationId,
    }, {
      $set: { [`homeScreenTitles.${fieldName}`]: fieldValue },
    });
  },

  deleteOrganization({ organizationId }) {
    const organization = this.collection.findOne({ _id: organizationId }, {
      fields: { 'users.userId': 1 },
    });

    const orgUsersIds = _(organization.users).pluck('userId');
    Roles.removeUsersFromRoles(
      orgUsersIds,
      _.union(OrgOwnerRoles, OrgMemberRoles),
      organizationId,
    );

    const collections = [
      Actions,
      AuditLogs,
      Departments,
      Discussions,
      Files,
      LessonsLearned,
      Messages,
      NonConformities,
      Occurrences,
      RiskTypes,
      Risks,
      StandardsBookSections,
      StandardTypes,
      Standards,
      WorkItems,
      Goals,
      Milestones,
    ];

    _(collections).each(coll => coll.direct.remove({ organizationId }));

    return this.collection.remove({ _id: organizationId });
  },

  changeCustomerType({ organizationId, customerType }) {
    const query = { _id: organizationId };
    const modifier = {
      $set: {
        customerType,
      },
    };

    return this.collection.update(query, modifier);
  },

  unsubscribeFromDailyRecap({ orgSerialNumber, userId }) {
    const query = {
      serialNumber: orgSerialNumber,
      users: {
        $elemMatch: {
          userId,
          sendDailyRecap: true,
        },
      },
    };
    const modifier = {
      $set: {
        'users.$.sendDailyRecap': false,
      },
    };

    return this.collection.update(query, modifier);
  },
};

export default OrganizationService;
