import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { pickNonInt } from 'plio-util';

import { BaseEntitySchema, OrganizationIdSchema } from './schemas';
import {
  StringLimits,
  ImportanceValues,
  CustomerElementStatuses,
  CanvasTypes,
} from '../constants';

const LinkedToSchema = new SimpleSchema({
  documentId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  documentType: {
    type: String,
    allowedValues: [CanvasTypes.VALUE_PROPOSITION, CanvasTypes.CUSTOMER_SEGMENT],
  },
});

const CustomerElementSchema = new SimpleSchema([
  BaseEntitySchema,
  OrganizationIdSchema,
  {
    serialNumber: {
      type: Number,
      min: 1,
    },
    title: {
      type: String,
      min: StringLimits.title.min,
      max: StringLimits.title.max,
    },
    description: {
      type: String,
      optional: true,
      max: StringLimits.description.max,
    },
    importance: {
      type: Number,
      allowedValues: ImportanceValues,
    },
    status: {
      type: Number,
      allowedValues: Object.values(pickNonInt(CustomerElementStatuses)),
      defaultValue: CustomerElementStatuses.UNMATCHED,
    },
    linkedTo: {
      type: [LinkedToSchema],
    },
  },
]);

export default CustomerElementSchema;
