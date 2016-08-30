import { Mongo } from 'meteor/mongo';

import { FileIdsSchema } from './files-schema.js';


const Files = new Mongo.Collection('Files');
Files.attachSchema(FileIdsSchema);

Files.helpers({
  isUploaded() {
    return this.progress === 1;
  }
});

export { Files };
