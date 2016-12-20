import {
  SET_DEPARTMENTS,
  SET_FILES,
  SET_NCS,
  SET_RISKS,
  SET_ACTIONS,
  SET_WORK_ITEMS,
  SET_STANDARD_BOOK_SECTIONS,
  SET_STANDARD_TYPES,
  SET_LESSONS_LEARNED,
  SET_STANDARDS,
  ADD_STANDARD,
  UPDATE_STANDARD,
  REMOVE_STANDARD,
  ADD_STANDARD_BOOK_SECTION,
  UPDATE_STANDARD_BOOK_SECTION,
  REMOVE_STANDARD_BOOK_SECTION,
  ADD_STANDARD_TYPE,
  UPDATE_STANDARD_TYPE,
  REMOVE_STANDARD_TYPE,
  SET_HELP_DOCS,
  SET_HELP_SECTIONS,
} from '../actions/types';
import { flattenObjects } from '/imports/api/helpers';
import { CollectionNames } from '/imports/share/constants';
import { STORE_COLLECTION_NAMES } from '../lib/constants';
import {
  getNormalizedDataKey,
  setC,
  addC,
  updateC,
  removeC,
} from '../lib/collectionsHelpers';

const initialState = flattenObjects(Object.keys(STORE_COLLECTION_NAMES).map(key => {
  const value = STORE_COLLECTION_NAMES[key];
  return { [value]: [], [getNormalizedDataKey(value)]: [] };
}));

export default function reducer(state = initialState, action) {
  const set = setC(state, action);
  const add = addC(state, action);
  const update = updateC(state, action);
  const remove = removeC(state, action);

  switch (action.type) {
    case SET_DEPARTMENTS:
    case SET_FILES:
    case SET_NCS:
    case SET_RISKS:
    case SET_ACTIONS:
    case SET_WORK_ITEMS:
    case SET_STANDARD_BOOK_SECTIONS:
    case SET_STANDARD_TYPES:
    case SET_LESSONS_LEARNED:
    case SET_STANDARDS:
    case SET_HELP_DOCS:
    case SET_HELP_SECTIONS:
      return set(Object.keys(action.payload)[0]);
    case ADD_STANDARD:
      return add(STORE_COLLECTION_NAMES[CollectionNames.STANDARDS]);
    case UPDATE_STANDARD:
      return update(STORE_COLLECTION_NAMES[CollectionNames.STANDARDS]);
    case REMOVE_STANDARD:
      return remove(STORE_COLLECTION_NAMES[CollectionNames.STANDARDS]);
    case ADD_STANDARD_BOOK_SECTION:
      return add(STORE_COLLECTION_NAMES[CollectionNames.STANDARD_BOOK_SECTIONS]);
    case UPDATE_STANDARD_BOOK_SECTION:
      return update(STORE_COLLECTION_NAMES[CollectionNames.STANDARD_BOOK_SECTIONS]);
    case REMOVE_STANDARD_BOOK_SECTION:
      return remove(STORE_COLLECTION_NAMES[CollectionNames.STANDARD_BOOK_SECTIONS]);
    case ADD_STANDARD_TYPE:
      return add(STORE_COLLECTION_NAMES[CollectionNames.STANDARD_TYPES]);
    case UPDATE_STANDARD_TYPE:
      return update(STORE_COLLECTION_NAMES[CollectionNames.STANDARD_TYPES]);
    case REMOVE_STANDARD_TYPE:
      return remove(STORE_COLLECTION_NAMES[CollectionNames.STANDARD_TYPES]);
    default:
      return state;
  }
}