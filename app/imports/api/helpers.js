import moment from 'moment-timezone';
import curry from 'lodash.curry';
import get from 'lodash.get';
import property from 'lodash.property';

import { CollectionNames, DocumentTypes } from './constants.js';
import { Actions } from './actions/actions.js';
import { NonConformities } from './non-conformities/non-conformities.js';
import { Risks } from './risks/risks.js';
import { Standards } from './standards/standards.js';

const { compose } = _;


const compareDates = (date1, date2) => {
  if (!_.isDate(date1)) {
    throw new Error(
      'First argument of "compareDates" function must be of type Date'
    );
  }

  if (!_.isDate(date2)) {
    throw new Error(
      'Second argument of "compareDates" function must be of type Date'
    );
  }

  const utcDate1 = new Date(
    date1.getTime() + (date1.getTimezoneOffset() * 60000)
  );

  const utcDate2 = new Date(
    date2.getTime() + (date2.getTimezoneOffset() * 60000)
  );

  if (utcDate1 > utcDate2) {
    return 1;
  } else if (utcDate1 === utcDate2) {
    return 0;
  } else if (utcDate1 < utcDate2) {
    return -1;
  }
};

const getFormattedDate = (date, stringFormat) => {
  return moment(date).format(stringFormat);
};

const getTzTargetDate = (targetDate, timezone) => {
  return moment.tz([
    targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()
  ], timezone).toDate();
};

const handleMethodResult = (cb) => {
  return (err, res) => {
    if (err) {
      toastr.error(err.reason);
    }
    if (_.isFunction(cb)) {
      cb(err, res);
    }
  };
};

const getCollectionByName = (colName) => {
  const collections = {
    [CollectionNames.ACTIONS]: Actions,
    [CollectionNames.NCS]: NonConformities,
    [CollectionNames.RISKS]: Risks,
    [CollectionNames.STANDARDS]: Standards
  };

  return collections[colName];
};

const getCollectionByDocType = (docType) => {
  const { STANDARD, NON_CONFORMITY, RISK } = DocumentTypes;
  switch(docType) {
    case STANDARD:
      return Standards;
      break;
    case NON_CONFORMITY:
      return NonConformities;
      break;
    case RISK:
      return Risks;
      break;
    default:
      return undefined;
      break;
  }
};

const chain = (...fns) => (...args) => fns.map(fn => fn(...args));

const chainCheckers = (...fns) => args => doc => fns.map(fn => fn(args, doc));

const inject = anything => fn => fn(anything);

const injectCurry = (anything, fn) => compose(inject(anything), curry)(fn);

const withUserId = fn => userId => fn({ userId });

const mapArgsTo = (fn, mapper) => (...args) => fn(mapper(...args));

const checkAndThrow = (predicate, error = '') => {
  if (predicate) throw error;

  return true;
};

const flattenObjects = (collection = []) => collection.reduce((prev, cur) => ({ ...prev, ...cur }), {});

const extractIds = (collection = []) => collection.map(property('_id'));

const not = expression => !expression;

const mapByIndex = (value = {}, index = 0, arr = []) =>
  Object.assign([], arr, { [index]: { ...arr[index], ...value } });

const mapValues = curry((mapper, obj) =>
  flattenObjects(Object.keys(obj).map(key => ({ [key]: mapper(obj[key], key, obj) }))));

export {
  compareDates,
  getCollectionByName,
  getFormattedDate,
  getTzTargetDate,
  handleMethodResult,
  getCollectionByDocType,
  chain,
  chainCheckers,
  checkAndThrow,
  inject,
  injectCurry,
  withUserId,
  mapArgsTo,
  flattenObjects,
  extractIds,
  not,
  mapByIndex,
  mapValues
};
