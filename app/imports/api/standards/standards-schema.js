import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { StandardStatuses } from '../constants.js';
import { BaseEntitySchema, OrganizationIdSchema, NotifySchema } from '../schemas.js';


const optionalFields = new SimpleSchema([
  NotifySchema,
  {
    description: {
      type: String,
      optional: true
    },
    isDeleted: {
      type: Boolean,
      optional: true
    },
    deletedBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    },
    deletedAt: {
      type: Date,
      optional: true
    },
    approved: {
      type: Boolean,
      optional: true
    },
    approvedAt: {
      type: Date,
      optional: true
    },
    notes: {
      type: String,
      optional: true
    },
    departments: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    },
    source1: {
      type: Object,
      optional: true
    },
    'source1.type': {
      type: String
    },
    'source1.url': {
      type: String,
      regEx: SimpleSchema.RegEx.Url,
      optional: true
    },
    'source1.name': {
      type: String,
      optional: true
    },
    source2: {
      type: Object,
      optional: true
    },
    'source2.type': {
      type: String
    },
    'source2.url': {
      type: String,
      regEx: SimpleSchema.RegEx.Url,
      optional: true
    },
    'source2.name': {
      type: String,
      optional: true
    },
    lessons: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    },
    viewedBy: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
      autoValue() {
        if (this.isInsert) {
          return [this.userId];
        }
      }
    }
  }
]);

const StandardsSchema = new SimpleSchema([
  optionalFields,
  BaseEntitySchema,
  OrganizationIdSchema,
  {
    title: {
      type: String
    },
    typeId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    sectionId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    nestingLevel: {
      type: Number
    },
    owner: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    issueNumber: {
      type: Number
    },
    status: {
      type: String,
      allowedValues: _.keys(StandardStatuses)
    }
  }
]);

const StandardsUpdateSchema = new SimpleSchema([optionalFields, {
  title: {
    type: String,
    optional: true
  },
  typeId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  sectionId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  nestingLevel: {
    type: Number,
    optional: true
  },
  description: {
    type: String,
    optional: true
  },
  owner: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  issueNumber: {
    type: Number,
    optional: true
  },
  status: {
    type: String,
    optional: true,
    allowedValues: _.keys(StandardStatuses)
  }
}]);

export { StandardsSchema, StandardsUpdateSchema };
