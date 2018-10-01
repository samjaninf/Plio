import { Mongo } from 'meteor/mongo';

import { CollectionNames } from '../constants';
import { RelationSchema } from '../schemas';

const Relations = new Mongo.Collection(CollectionNames.RELATIONS);
Relations.attachSchema(RelationSchema);

export { Relations };
