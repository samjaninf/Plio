import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import OrganizationService from './organization-service.js';


export const insert = new ValidatedMethod({
  name: 'Organizations.insert',

  validate: new SimpleSchema({
    name: { type: String }
  }).validator(),

  run({ name }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot create an organization'
      );
    }

    return OrganizationService.insert({
      name,
      ownerId: userId
    });
  }
});