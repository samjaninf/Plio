import { Mongo } from 'meteor/mongo';

import { FeatureSchema } from '../schemas';
import { CollectionNames } from '../constants';

const Features = new Mongo.Collection(CollectionNames.FEATURES);

Features.attachSchema(FeatureSchema);

export { Features };
