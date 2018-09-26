import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema } from './schemas';
import { DocumentTypes } from '../constants';

const RelSchema = new SimpleSchema({
  documentId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  documentType: {
    type: String,
    allowedValues: Object.values(DocumentTypes),
  },
});

const RelationSchema = new SimpleSchema([
  BaseEntitySchema,
  {
    rel1: {
      type: RelSchema,
    },
    rel2: {
      type: RelSchema,
    },
  },
]);

export default RelationSchema;
