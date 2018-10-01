import { Mongo } from 'meteor/mongo';

import { BenefitSchema } from '../schemas';
import { CollectionNames } from '../constants';

const Benefits = new Mongo.Collection(CollectionNames.BENEFITS);

Benefits.attachSchema(BenefitSchema);

export { Benefits };
