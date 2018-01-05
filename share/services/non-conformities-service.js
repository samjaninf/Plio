import { Meteor } from 'meteor/meteor';

import { NonConformities } from '/imports/share/collections/non-conformities.js';
import ProblemsService from '/imports/share/services/problems-service.js';
import { ProblemTypes } from '/imports/share/constants.js';
import BaseEntityService from '/imports/share/services/base-entity-service.js';


export default _.extend({}, ProblemsService, {
  collection: NonConformities,

  _service: new BaseEntityService(NonConformities),

  _abbr: 'NC',

  _docType: ProblemTypes.NON_CONFORMITY,

  _getDoc(_id) {
    const NC = this.collection.findOne({ _id });
    if (!NC) {
      throw new Meteor.Error(400, 'Nonconformity does not exist');
    }
    return NC;
  },
});