import { check } from 'meteor/check';
import moment from 'moment-timezone';
import Handlebars from 'handlebars';

import {
  AvatarPlaceholders,
  CollectionNames,
  DocumentTypes,
  ProblemMagnitudes,
  SystemName,
} from './constants.js';
import { Actions } from './collections/actions.js';
import { NonConformities } from './collections/non-conformities.js';
import { Risks } from './collections/risks.js';
import { Standards } from './collections/standards.js';
import { Organizations } from './collections/organizations';


export const capitalize = str => str.charAt(0).toUpperCase() + str.substring(1);

export const lowercase = str => str.charAt(0).toLowerCase() + str.substring(1);

export const deepExtend = (dest, src) => {
  _(src).each((val, key) => {
    if (_(val).isObject() && _(dest[key]).isObject()) {
      deepExtend(dest[key], val);
    } else {
      dest[key] = val;
    }
  });
};

export const getCollectionByName = (colName) => {
  const collections = {
    [CollectionNames.ACTIONS]: Actions,
    [CollectionNames.NCS]: NonConformities,
    [CollectionNames.RISKS]: Risks,
    [CollectionNames.STANDARDS]: Standards,
    [CollectionNames.ORGANIZATIONS]: Organizations
  };

  return collections[colName];
};

export const getCollectionByDocType = (docType) => {
  switch(docType) {
    case DocumentTypes.STANDARD:
      return Standards;

    case DocumentTypes.NON_CONFORMITY:
      return NonConformities;

    case DocumentTypes.RISK:
      return Risks;

    case DocumentTypes.CORRECTIVE_ACTION:
    case DocumentTypes.PREVENTATIVE_ACTION:
    case DocumentTypes.RISK_CONTROL:
      return Actions;

    default:
      return undefined;
  }
};

export const getCollectionNameByDocType = (docType) => {
  return {
    [DocumentTypes.STANDARD]: CollectionNames.STANDARDS,
    [DocumentTypes.NON_CONFORMITY]: CollectionNames.NCS,
    [DocumentTypes.RISK]: CollectionNames.RISKS
  }[docType];
};

export const getFormattedDate = (date, stringFormat) => {
  return moment(date).format(stringFormat);
};

export const getLinkedDoc = (documentId, documentType) => {
  const collection = getCollectionByDocType(documentType);
  return collection.findOne({ _id: documentId });
};

export const getRandomAvatarUrl = () => {
  const randomAvatarIndex = Math.floor(Math.random() * 16);
  return AvatarPlaceholders[randomAvatarIndex];
};

export const getTitlePrefix = (title) => {
  let titlePrefix;
  const matchedPrefixArray = title.match(/^[\d\.]+/g);

  if (matchedPrefixArray && matchedPrefixArray.length) {
    const stringPrefix = matchedPrefixArray[0];

    // Convert 1.2.3.4 to 1.2345 for sorting purposes
    const stringPrefixFloat = stringPrefix.replace(/^([^.]*\.)(.*)$/, function (a, b, c) {
      return b + c.replace(/\./g, '');
    });
    titlePrefix = parseFloat(stringPrefixFloat);

    if (!titlePrefix && titlePrefix !== 0) {
      titlePrefix = title;
    }
  } else {
    titlePrefix = title;
  }

  return titlePrefix;
};

export const getTzTargetDate = (targetDate, timezone) => {
  return targetDate && moment.tz([
    targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()
  ], timezone).toDate();
};

export const getWorkflowDefaultStepDate = ({ organization, linkedTo }) => {
  let magnitude = ProblemMagnitudes.MINOR;

  // Select the highest magnitude among all linked documents
  _.each(linkedTo, ({ documentId, documentType }) => {
    const collection = getCollectionByDocType(documentType);
    const doc = collection.findOne({ _id: documentId });
    if (magnitude === ProblemMagnitudes.CRITICAL) {
      return;
    }

    if (doc.magnitude === ProblemMagnitudes.MINOR) {
      return;
    }

    magnitude = doc.magnitude;
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
      $type: 16 // 32-bit integer
    }
  }, {
    sort: {
      serialNumber: -1
    }
  });

  return last ? last.serialNumber + 1 : defaultNumber;
};

export const generateUserInitials = (userProfile) => {
  const { firstName, lastName} = userProfile;
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
};

export const isDueToday = (targetDate, timezone) => {
  return checkTargetDate(targetDate, timezone) === 0;
};

export const isOverdue = (targetDate, timezone) => {
  return checkTargetDate(targetDate, timezone) === 1;
};

export const renderTemplate = (template, data = {}) => {
  const compiledTemplate = Handlebars.compile(template);
  return compiledTemplate(data);
};

export const getUser = (userId) => {
  return Meteor.users.findOne({ _id: userId });
};

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
