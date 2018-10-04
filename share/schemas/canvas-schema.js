import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import {
  BaseEntitySchema,
  OrganizationIdSchema,
  idSchemaDoc,
  FileIdsSchema,
} from './schemas';
import { StringLimits, CanvasColors } from '../constants';

const CanvasSchema = new SimpleSchema([
  BaseEntitySchema,
  OrganizationIdSchema,
  FileIdsSchema,
  {
    title: {
      type: String,
      min: StringLimits.title.min,
      max: StringLimits.title.max,
    },
    originatorId: idSchemaDoc,
    notes: {
      type: String,
      optional: true,
      max: StringLimits.description.max,
    },
    color: {
      type: String,
      allowedValues: Object.values(CanvasColors),
    },
    goalIds: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
      defaultValue: [],
    },
    standardIds: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
      defaultValue: [],
    },
    riskIds: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
      defaultValue: [],
    },
  },
]);

export default CanvasSchema;
