import { Meteor } from 'meteor/meteor';

const { Error:E } = Meteor;

export * from './work-items/errors.js';

export * from './messages/errors.js';

export const NOT_AN_ORG_MEMBER = new E(403, 'You are not a member of this organization');

export const DOC_NOT_FOUND = new E(400, 'The document you are looking for is not found');

export const UNAUTHORIZED = new E(403, 'Unauthorized user is not allowed to change documents');

export const CANNOT_RESTORE_NOT_DELETED = new E(400, 'The document you are trying to restore is not deleted');

export const ONLY_OWNER_CAN_DELETE = new E(403, 'Only document owner or organization owner can delete it');
