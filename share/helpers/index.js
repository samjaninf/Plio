import { concat } from 'ramda';
import { mapKeys } from 'plio-util';
import { check } from 'meteor/check';
import get from 'lodash.get';
import moment from 'moment-timezone';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import {
  AvatarPlaceholders,
  CollectionNames,
  DocumentTypes,
  ProblemMagnitudes,
  SystemName,
  DocumentTypesPlural,
  AllDocumentTypes,
  WORKSPACE_DEFAULTS,
} from '../constants';
import {
  Actions,
  NonConformities,
  Risks,
  Standards,
  Organizations,
  Discussions,
  Goals,
  Milestones,
  KeyPartners,
  KeyActivities,
  KeyResources,
  ValuePropositions,
  CustomerRelationships,
  Channels,
  CustomerSegments,
  CostLines,
  RevenueStreams,
  Benefits,
  Features,
  Needs,
  Wants,
} from '../collections';

export * from './actions';
export * from './goals';
export * from './milestones';

export const capitalize = str => `${str}`.charAt(0).toUpperCase() + `${str}`.substring(1);

export const lowercase = str => `${str}`.charAt(0).toLowerCase() + `${str}`.substring(1);

export const deepExtend = (dest, src) => {
  _(src).each((val, key) => {
    if (_(val).isObject() && _(dest[key]).isObject()) {
      deepExtend(dest[key], val);
    } else {
      dest[key] = val; // eslint-disable-line no-param-reassign
    }
  });
};

export const getCollectionByName = (colName) => {
  const collections = {
    [CollectionNames.ACTIONS]: Actions,
    [CollectionNames.NCS]: NonConformities,
    [CollectionNames.RISKS]: Risks,
    [CollectionNames.STANDARDS]: Standards,
    [CollectionNames.ORGANIZATIONS]: Organizations,
  };

  return collections[colName];
};

export const getCollectionByDocType = (docType) => {
  switch (docType) {
    case AllDocumentTypes.STANDARD:
      return Standards;

    case AllDocumentTypes.NON_CONFORMITY:
    case AllDocumentTypes.POTENTIAL_GAIN:
      return NonConformities;

    case AllDocumentTypes.RISK:
      return Risks;

    case AllDocumentTypes.CORRECTIVE_ACTION:
    case AllDocumentTypes.PREVENTATIVE_ACTION:
    case AllDocumentTypes.RISK_CONTROL:
    case AllDocumentTypes.GENERAL_ACTION:
      return Actions;

    case AllDocumentTypes.DISCUSSION:
      return Discussions;

    case AllDocumentTypes.GOAL:
      return Goals;

    case AllDocumentTypes.MILESTONE:
      return Milestones;

    case AllDocumentTypes.KEY_PARTNER:
      return KeyPartners;

    case AllDocumentTypes.KEY_ACTIVITY:
      return KeyActivities;

    case AllDocumentTypes.KEY_RESOURCE:
      return KeyResources;

    case AllDocumentTypes.VALUE_PROPOSITION:
      return ValuePropositions;

    case AllDocumentTypes.CUSTOMER_RELATIONSHIP:
      return CustomerRelationships;

    case AllDocumentTypes.CHANNEL:
      return Channels;

    case AllDocumentTypes.CUSTOMER_SEGMENT:
      return CustomerSegments;

    case AllDocumentTypes.COST_LINE:
      return CostLines;

    case AllDocumentTypes.REVENUE_STREAM:
      return RevenueStreams;

    case AllDocumentTypes.BENEFIT:
      return Benefits;

    case AllDocumentTypes.FEATURE:
      return Features;

    case AllDocumentTypes.NEED:
      return Needs;

    case AllDocumentTypes.WANT:
      return Wants;

    default:
      return undefined;
  }
};

export const getCollectionNameByDocType = docType => ({
  [DocumentTypes.STANDARD]: CollectionNames.STANDARDS,
  [DocumentTypes.NON_CONFORMITY]: CollectionNames.NCS,
  [DocumentTypes.RISK]: CollectionNames.RISKS,
})[docType];

export const getFormattedDate = (date, stringFormat) => {
  let format = stringFormat;
  if (typeof format !== 'string') format = 'DD MMM YYYY';
  return moment(date).format(format);
};

export const getDocTypePlural = docType => ({
  [DocumentTypes.STANDARD]: DocumentTypesPlural.STANDARDS,
  [DocumentTypes.RISK]: DocumentTypesPlural.RISKS,
  [DocumentTypes.NON_CONFORMITY]: DocumentTypesPlural.NON_CONFORMITIES,
  [DocumentTypes.POTENTIAL_GAIN]: DocumentTypesPlural.POTENTIAL_GAINS,
})[docType];

export const getLinkedDoc = (documentId, documentType) => {
  const collection = getCollectionByDocType(documentType);
  return collection.findOne({ _id: documentId });
};

export const getRandomAvatarUrl = () => {
  const randomAvatarIndex = Math.floor(Math.random() * 16);
  return AvatarPlaceholders[randomAvatarIndex];
};

export const getTzTargetDate = (targetDate, timezone) => targetDate && moment.tz([
  targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(),
], timezone).toDate();

export const getFormattedTzDate = (timezone, format = 'z Z') =>
  moment.tz(timezone).format(format);

export const getWorkflowDefaultStepDate = ({ organization, linkedTo }) => {
  let magnitude = ProblemMagnitudes.MINOR;

  // Select the highest magnitude among all linked documents
  _.each(linkedTo, ({ documentId, documentType }) => {
    const collection = getCollectionByDocType(documentType);
    const doc = collection.findOne({ _id: documentId });

    if (!doc || !doc.magnitude) return;

    if (magnitude === ProblemMagnitudes.CRITICAL) {
      return;
    }

    if (doc.magnitude === ProblemMagnitudes.MINOR) {
      return;
    }

    magnitude = doc.magnitude; // eslint-disable-line prefer-destructuring
  });

  const workflowStepTime = organization.workflowStepTime(magnitude);
  const { timeValue, timeUnit } = workflowStepTime;
  const date = moment()
    .tz(organization.timezone)
    .startOf('day')
    .add(timeValue, timeUnit)
    .toDate();

  return date;
};

export const generateSerialNumber = (collection, query = {}, defaultNumber = 1) => {
  check(defaultNumber, Number);

  const last = collection.findOne({
    ...query,
    serialNumber: {
      $type: 16, // 32-bit integer
    },
  }, {
    sort: {
      serialNumber: -1,
    },
  });

  return last ? last.serialNumber + 1 : defaultNumber;
};

export const generateUserInitials = (userProfile) => {
  const { firstName, lastName } = userProfile;
  let initials = '';
  if (firstName) {
    initials += firstName.charAt(0);
  }

  if (lastName) {
    initials += lastName.charAt(0);
  }

  return initials.toUpperCase();
};

const checkTargetDate = (targetDate, timezone) => {
  if (!targetDate) {
    return false;
  }

  // eslint-disable-next-line no-param-reassign
  timezone = timezone || moment.tz.guess();

  const tzNow = moment().tz(timezone);
  const tzTargetDate = moment(targetDate).tz(timezone);

  if (tzNow.isAfter(tzTargetDate, 'day')) {
    return 1;
  } else if (tzNow.isSame(tzTargetDate, 'day')) {
    return 0;
  } else if (tzNow.isBefore(tzTargetDate, 'day')) {
    return -1;
  }

  return undefined;
};

export const isDueToday = (targetDate, timezone) => checkTargetDate(targetDate, timezone) === 0;

export const isOverdue = (targetDate, timezone) => checkTargetDate(targetDate, timezone) === 1;

export const getUser = userId => Meteor.users.findOne({ _id: userId });

export const getUserFullNameOrEmail = (userOrId) => {
  let user = userOrId;
  if (typeof userOrId === 'string') {
    if (userOrId === SystemName) {
      return userOrId;
    }

    user = getUser(userOrId);
  }

  return (user && user.fullNameOrEmail()) || '';
};

export const htmlToPlainText = (html) => {
  check(html, String);

  return html.replace(/<br>/gi, '\n')
    .replace(/<p.*>/gi, '\n')
    .replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, ' $2 (Link->$1) ')
    .replace(/<(?:.|\s)*?>/g, '')
    .trim();
};

export const sanitizeFilename = (str) => {
  check(str, String);

  return str.replace(/[^a-z0-9.]/gi, '_').replace(/_{2,}/g, '_');
};

export const getDocByIdAndType = (documentId, documentType) => {
  const collection = getCollectionByDocType(documentType);
  return collection && collection.findOne({ _id: documentId });
};

export const getReviewConfig = (organization, documentType) => {
  const documentKey = {
    [DocumentTypes.STANDARD]: 'standards',
    [DocumentTypes.RISK]: 'risks',
  }[documentType];

  return get(organization, `review.${documentKey}`);
};

export const forEachOrgsUser = (f) => {
  Organizations.find({}).forEach(({ users, ...organization }) => {
    users.forEach(user => f(organization, user));
  });
};

export const addRolesToAllUsers = roles =>
  forEachOrgsUser(({ _id: organizationId }, { userId, isRemoved }) => {
    if (!isRemoved) {
      Roles.addUsersToRoles(userId, roles, organizationId);
    }
  });

export const removeRolesFromAllUsers = roles =>
  forEachOrgsUser(({ _id: organizationId }, { userId }) => {
    Roles.removeUsersFromRoles(userId, roles, organizationId);
  });

export const getWorkspaceDefaultsUpdater = mapKeys(concat(`${WORKSPACE_DEFAULTS}.`));
