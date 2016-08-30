import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ValidationError } from 'meteor/mdg:validation-error';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Accounts } from 'meteor/accounts-base'
import { Roles } from 'meteor/alanning:roles';

import UserService from './user-service.js';
import { UserProfileSchema, PhoneNumberSchema } from './user-schema.js';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { IdSchema, UserIdSchema } from '../schemas.js';
import { UserRoles, UserMembership } from '../constants.js';
import Method from '../method.js';
import { withUserId, chain, mapArgsTo } from '../helpers.js';
import {
  checkOrgMembership,
  exists,
  USR_EnsureUpdatingHimselfChecker,
  USR_EnsureCanChangeRolesChecker,
  USR_EnsureIsNotOrgOwnerChecker
} from '../checkers.js';

const { compose } = _;

const checkOrganizationExistance = exists(Organizations);

const ensureUpdatingHimself = withUserId(USR_EnsureUpdatingHimselfChecker);

const ensureCanChangeRoles = withUserId(USR_EnsureCanChangeRolesChecker);

const userIdToId = ({ userId:_id }) => ({ _id });

export const remove = new Method({
  name: 'Users.remove',

  validate: new SimpleSchema({}).validator(),

  run({}) {
    return UserService.remove({ _id: this.userId });
  }
});

export const selectOrganization = new Method({
  name: 'Users.selectOrganization',

  validate: new SimpleSchema({
    selectedOrganizationSerialNumber: {
      type: Number
    }
  }).validator(),

  check(checker) {
    const mapper = ({ selectedOrganizationSerialNumber:serialNumber }) => ({ serialNumber });
    const _checkMembership = ({ _id }) => checkOrgMembership(this.userId, _id);

    return compose(checker, compose)(_checkMembership, checkOrganizationExistance(mapper));
  },

  run({ selectedOrganizationSerialNumber }) {
    return UserService.update(this.userId, {
      selectedOrganizationSerialNumber
    });
  }
});

export const updateProfile = new Method({
  name: 'Users.updateProfile',

  validate(doc) {
    const validationContext = new SimpleSchema([
      IdSchema,
      UserProfileSchema
    ]).newContext();

    for (let key in doc) {
      if (!validationContext.validateOne(doc, key)) {
        const errors = validationContext.invalidKeys();
        const message = validationContext.keyErrorMessage(errors[0].name);
        throw new ValidationError(errors, message);
      }
    }
  },

  check(checker) {
    return checker(
      ensureUpdatingHimself(this.userId)
    );
  },

  run({ _id, ...args }) {
    UserService.updateProfile(_id, args);
  }
});

export const unsetProfileProperty = new Method({
  name: 'Users.unsetProfileProperty',

  validate: new SimpleSchema([
    IdSchema,
    {
      fieldName: {
        type: String,
        allowedValues: UserProfileSchema.objectKeys()
      }
    }
  ]).validator(),

  check(checker) {
    return checker(
      ensureUpdatingHimself(this.userId)
    );
  },

  run({ _id, fieldName }) {
    const fieldDef = UserProfileSchema.getDefinition(fieldName);
    if (!(fieldDef.optional === true)) {
      throw new Meteor.Error(
        400,
        UserProfileSchema.messageForError('required', fieldName, null, '')
      );
    }

    UserService.unsetProfileProperty({ _id, fieldName });
  }
});

export const updateEmail = new Method({
  name: 'Users.updateEmail',

  validate: new SimpleSchema([IdSchema, {
    email: {
      type: String,
      regEx: SimpleSchema.RegEx.Email
    }
  }]).validator(),

  check(checker) {
    return checker(
      ensureUpdatingHimself(this.userId)
    );
  },

  run({ _id, email }) {
    return UserService.updateEmail(_id, email);
  }
});

export const updatePhoneNumber = new Method({
  name: 'Users.updatePhoneNumber',

  validate: new SimpleSchema([
    UserIdSchema,
    PhoneNumberSchema
  ]).validator(),

  check(checker) {
    return compose(checker, mapArgsTo)(ensureUpdatingHimself(this.userId), userIdToId);
  },

  run({ userId, ...args }) {
    return UserService.updatePhoneNumber({ userId, ...args });
  }
});

export const addPhoneNumber = new Method({
  name: 'Users.addPhoneNumber',

  validate: new SimpleSchema([
    UserIdSchema,
    PhoneNumberSchema
  ]).validator(),

  check(checker) {
    return compose(checker, mapArgsTo)(ensureUpdatingHimself(this.userId), userIdToId);
  },

  run({ userId, ...args }) {
    return UserService.addPhoneNumber({ userId, ...args });
  }
});

export const removePhoneNumber = new Method({
  name: 'Users.removePhoneNumber',

  validate: new SimpleSchema([
    UserIdSchema,
    IdSchema
  ]).validator(),

  check(checker) {
    return compose(checker, mapArgsTo)(ensureUpdatingHimself(this.userId), userIdToId);
  },

  run({ userId, ...args }) {
    return UserService.removePhoneNumber({ userId, ...args });
  }
});

const changeRoleSchema = new SimpleSchema([IdSchema, {
  organizationId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  role: {
    type: String,
    allowedValues: _.values(UserRoles)
  }
}]);

export const assignRole = new Method({
  name: 'Users.assignRole',

  validate: changeRoleSchema.validator(),

  check(checker) {
    return compose(checker, chain)(USR_EnsureIsNotOrgOwnerChecker, ensureCanChangeRoles(this.userId));
  },

  run({ _id, organizationId, role }) {
    return Roles.addUsersToRoles(_id, role, organizationId);
  }
});

export const revokeRole = new Method({
  name: 'Users.revokeRole',

  validate: changeRoleSchema.validator(),

  check(checker) {
    return compose(checker, chain)(USR_EnsureIsNotOrgOwnerChecker, ensureCanChangeRoles(this.userId));
  },

  run({ _id, organizationId, role }) {
    return Roles.removeUsersFromRoles(_id, role, organizationId);
  }
});

export const sendVerificationEmail = new Method({
  name: 'Users.sendVerificationEmail',

  validate: new SimpleSchema({}).validator(),

  run() {
    if (!this.isSimulation) {
      return Accounts.sendVerificationEmail(this.userId);
    }
  }
});

export const setNotifications = new Method({
  name: 'Users.setNotifications',

  validate: new SimpleSchema([
    IdSchema,
    {
      enabled: { type: Boolean }
    }
  ]).validator(),

  check(checker) {
    return checker(
      ensureUpdatingHimself(this.userId)
    );
  },

  run({ _id, enabled }) {
    return UserService.setNotifications({ _id, enabled });
  }
});

export const setNotificationSound = new Method({
  name: 'Users.setNotificationSound',

  validate: new SimpleSchema([
    IdSchema,
    {
      soundFile: { type: String }
    }
  ]).validator(),

  check(checker) {
    return checker(
      ensureUpdatingHimself(this.userId)
    );
  },

  run({ _id, soundFile }) {
    return UserService.setNotificationSound({ _id, soundFile });
  }
});
