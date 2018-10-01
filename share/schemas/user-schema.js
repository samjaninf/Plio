import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { PhoneTypes, StringLimits } from '../constants';
import { TimezoneSchema, homeScreenTypeSchemaObj } from './schemas';

const PhoneNumberSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  number: {
    label: 'Phone number',
    type: String,
    regEx: /^[+|0-9][0-9\-\s()]+$/,
  },
  type: {
    type: String,
    allowedValues: Object.values(PhoneTypes),
  },
});

const UserProfileSchema = new SimpleSchema({
  firstName: {
    type: String,
    min: StringLimits.title.min,
    max: StringLimits.title.max,
  },
  lastName: {
    type: String,
    min: StringLimits.title.min,
    max: StringLimits.title.max,
  },
  initials: {
    type: String,
    min: 2,
    max: 3,
    optional: true,
  },
  description: {
    type: String,
    optional: true,
    max: StringLimits.comments.max,
  },
  avatar: {
    type: String,
  },
  skype: {
    type: String,
    optional: true,
    max: StringLimits.title.max,
  },
  country: {
    type: String,
    optional: true,
  },
  address: {
    type: String,
    optional: true,
  },
  phoneNumbers: {
    type: [PhoneNumberSchema],
    optional: true,
  },
  // temporary fields, needed to create an organization
  organizationName: {
    type: String,
    optional: true,
  },
  organizationHomeScreen: homeScreenTypeSchemaObj,
  organizationTimezone: TimezoneSchema.getDefinition('timezone'),
});

const UserPreferencesSchema = new SimpleSchema({
  areNotificationsEnabled: {
    type: Boolean,
    defaultValue: true,
  },
  areEmailNotificationsEnabled: {
    type: Boolean,
    defaultValue: true,
  },
  notificationSound: {
    type: String,
    defaultValue: '/sounds/graceful',
    optional: true,
  },
});

const UserEmailSchema = new SimpleSchema({
  address: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
  verified: {
    type: Boolean,
    defaultValue: false,
  },
});

const UserSchema = new SimpleSchema({
  createdAt: {
    type: Date,
  },
  services: {
    type: Object,
    blackbox: true,
  },
  emails: {
    type: [UserEmailSchema],
  },
  profile: {
    type: UserProfileSchema,
  },
  status: {
    type: String,
    optional: true,
  },
  statusConnection: {
    type: String,
    optional: true,
  },
  statusDefault: {
    type: String,
    optional: true,
  },
  roles: {
    type: Object,
    blackbox: true,
    optional: true,
  },
  preferences: {
    type: UserPreferencesSchema,
  },
  invitationId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
  invitedAt: {
    type: Date,
    optional: true,
  },
  invitedBy: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
  invitationExpirationDate: {
    type: Date,
    optional: true,
  },
  invitationOrgId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
  receiveEmailNotifications: {
    type: Boolean,
    optional: true,
    defaultValue: true,
  },
});

export { UserSchema, UserProfileSchema, PhoneNumberSchema };
