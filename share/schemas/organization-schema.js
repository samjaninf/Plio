import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';

import {
  OrgCurrencies, WorkflowTypes, UserMembership,
  StandardTitles, RiskTitles, NonConformitiesTitles,
  WorkInboxTitles, CustomerTypes, PossibleReviewFrequencies,
  HomeScreenTitlesTypes, OrganizationDefaults,
} from '../constants';
import {
  BaseEntitySchema, ReminderTimePeriodSchema,
  TimezoneSchema, TimePeriodSchema,
  idSchemaDoc, WorkspaceDefaultsSchema,
  homeScreenTypeSchemaObj,
} from './schemas';

export const HomeTitlesSchema = new SimpleSchema({
  [HomeScreenTitlesTypes.STANDARDS]: {
    type: String,
  },
  [HomeScreenTitlesTypes.RISKS]: {
    type: String,
  },
  [HomeScreenTitlesTypes.NON_CONFORMITIES]: {
    type: String,
  },
  [HomeScreenTitlesTypes.WORK_INBOX]: {
    type: String,
  },
});

const UserSettingsSchema = new SimpleSchema({
  sendDailyRecap: {
    type: Boolean,
    autoValue() {
      if (!this.isSet) {
        return true;
      }

      return undefined;
    },
  },
});

const OrgUserSchema = new SimpleSchema([
  {
    userId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    role: {
      type: String,
      allowedValues: _.values(UserMembership),
    },
    joinedAt: {
      autoValue() {
        if (!this.isSet) {
          return new Date();
        }

        return undefined;
      },
      type: Date,
    },
    isRemoved: {
      type: Boolean,
      autoValue() {
        if (!this.isSet) {
          return false;
        }

        return undefined;
      },
    },
    removedAt: {
      type: Date,
      optional: true,
    },
    removedBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
    },
  },
  UserSettingsSchema,
]);

const problemWorkflowSchema = new SimpleSchema({
  workflowType: {
    type: String,
    allowedValues: _.values(WorkflowTypes),
  },
  stepTime: {
    type: ReminderTimePeriodSchema,
  },
});

const workflowDefaultsSchema = new SimpleSchema({
  minorProblem: {
    type: problemWorkflowSchema,
  },
  majorProblem: {
    type: problemWorkflowSchema,
  },
  criticalProblem: {
    type: problemWorkflowSchema,
  },
  isActionsCompletionSimplified: {
    type: Boolean,
    defaultValue: OrganizationDefaults.workflowDefaults.isActionsCompletionSimplified,
  },
});

const reminderSchema = new SimpleSchema({
  start: {
    type: ReminderTimePeriodSchema,
  },
  interval: {
    type: ReminderTimePeriodSchema,
  },
  until: {
    type: ReminderTimePeriodSchema,
  },
});

const remindersSchema = new SimpleSchema({
  minorNc: {
    type: reminderSchema,
  },
  majorNc: {
    type: reminderSchema,
  },
  criticalNc: {
    type: reminderSchema,
  },
  improvementPlan: {
    type: reminderSchema,
  },
});

const OrganizationCurrencySchema = {
  currency: {
    type: String,
    allowedValues: _.values(OrgCurrencies),
    optional: true,
  },
};

const ncGuidelinesSchema = new SimpleSchema({
  minor: {
    type: String,
    label: 'Guideline for classifying a minor nonconformity',
  },
  major: {
    type: String,
    label: 'Guideline for classifying a major nonconformity',
  },
  critical: {
    type: String,
    label: 'Guideline for classifying a critical nonconformity',
  },
});

const pgGuidelinesSchema = new SimpleSchema({
  minor: {
    type: String,
    label: 'Guideline for classifying a minor potential gain',
  },
  major: {
    type: String,
    label: 'Guideline for classifying a major potential gain',
  },
  critical: {
    type: String,
    label: 'Guideline for classifying a critical potential gain',
  },
});

const rkGuidelinesSchema = new SimpleSchema({
  minor: {
    type: String,
    label: 'Guideline for initial categorization of a minor risk',
  },
  major: {
    type: String,
    label: 'Guideline for initial categorization of a major risk',
  },
  critical: {
    type: String,
    label: 'Guideline for initial categorization of a critical risk',
  },
});

export const reviewReviewerIdSchema = new SimpleSchema({
  reviewerId: {
    type: idSchemaDoc,
    autoValue() {
      if (this.isInsert && !this.isSet) {
        const createdBy = this.field('createdBy');
        if (createdBy.isSet) {
          return createdBy.value;
        }
      }

      return undefined;
    },
  },
});

export const reviewFrequencySchema = new SimpleSchema({
  frequency: {
    type: TimePeriodSchema,
    custom() {
      const isValid = PossibleReviewFrequencies.find(freqDef => (
        _.isEqual(freqDef, this.value)
      ));

      return isValid ? true : 'notAllowed';
    },
  },
});

export const reviewAnnualDateSchema = new SimpleSchema({
  annualDate: {
    type: Date,
    autoValue() {
      if (this.isInsert && !this.isSet) {
        const createdAt = this.field('createdAt');
        if (createdAt.isSet) {
          return createdAt.value;
        }
      }

      return undefined;
    },
  },
});

export const reviewConfigSchema = new SimpleSchema([
  reviewReviewerIdSchema,
  reviewFrequencySchema,
  reviewAnnualDateSchema,
  {
    reminders: {
      type: reminderSchema,
    },
  },
]);

const reviewSchema = new SimpleSchema({
  risks: {
    type: reviewConfigSchema,
  },
  standards: {
    type: reviewConfigSchema,
  },
});

const OrganizationEditableFields = {
  name: {
    type: String,
    min: 1,
    max: 40,
  },
  workflowDefaults: {
    type: workflowDefaultsSchema,
    optional: true,
  },
  reminders: {
    type: remindersSchema,
    optional: true,
  },
  ncGuidelines: {
    type: ncGuidelinesSchema,
    optional: true,
  },
  pgGuidelines: {
    type: pgGuidelinesSchema,
    optional: true,
  },
  rkGuidelines: {
    type: rkGuidelinesSchema,
    optional: true,
  },
  rkScoringGuidelines: {
    type: String,
    label: 'Risk scoring guidelines text',
    optional: true,
  },
  review: {
    type: reviewSchema,
    optional: true,
  },
  ...OrganizationCurrencySchema,
  ...TimezoneSchema.schema(),
};

const transferSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  newOwnerId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  createdAt: {
    type: Date,
  },
});

const CustomerTypeSchema = new SimpleSchema({
  customerType: {
    type: Number,
    allowedValues: _.values(CustomerTypes),
    defaultValue: CustomerTypes.FREE_TRIAL,
  },
});

const OrganizationSchema = new SimpleSchema([
  BaseEntitySchema,
  OrganizationEditableFields,
  CustomerTypeSchema,
  WorkspaceDefaultsSchema,
  {
    homeScreenTitles: {
      type: HomeTitlesSchema,
      defaultValue: {
        [HomeScreenTitlesTypes.STANDARDS]: _.first(StandardTitles),
        [HomeScreenTitlesTypes.RISKS]: _.first(RiskTitles),
        [HomeScreenTitlesTypes.NON_CONFORMITIES]: _.first(NonConformitiesTitles),
        [HomeScreenTitlesTypes.WORK_INBOX]: _.first(WorkInboxTitles),
      },
    },
    serialNumber: {
      type: Number,
      min: 0,
    },
    users: {
      type: [OrgUserSchema],
      minCount: 1,
      defaultValue: [],
    },
    transfer: {
      type: transferSchema,
      optional: true,
    },
    lastAccessedDate: {
      type: Date,
      optional: true,
      autoValue() {
        if (this.isInsert && !this.isSet) {
          return new Date();
        }

        return undefined;
      },
    },
    homeScreenType: homeScreenTypeSchemaObj,
  },
]);

export {
  OrganizationEditableFields,
  OrganizationSchema,
  OrganizationCurrencySchema,
  UserSettingsSchema,
  CustomerTypeSchema,
};
