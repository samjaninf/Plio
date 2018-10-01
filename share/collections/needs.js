import { Mongo } from 'meteor/mongo';

import { NeedSchema } from '../schemas';
import { CollectionNames } from '../constants';

const Needs = new Mongo.Collection(CollectionNames.NEEDS);

Needs.attachSchema(NeedSchema);

export { Needs };
