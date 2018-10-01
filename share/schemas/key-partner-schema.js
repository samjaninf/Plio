import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import CanvasSchema from './canvas-schema';

const KeyPartnerSchema = new SimpleSchema([
  CanvasSchema,
  {
    criticality: {
      type: Number,
      min: 0,
      max: 100,
    },
    levelOfSpend: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
]);

export default KeyPartnerSchema;
