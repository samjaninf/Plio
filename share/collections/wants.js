import { Mongo } from 'meteor/mongo';

import { WantSchema } from '../schemas';
import { CollectionNames } from '../constants';

const Wants = new Mongo.Collection(CollectionNames.WANTS);

Wants.attachSchema(WantSchema);

export { Wants };
