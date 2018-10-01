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
  },
]);

export default CanvasSchema;
