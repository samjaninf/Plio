import { Meteor } from 'meteor/meteor';
import Random from 'meteor/random';

import { Risks } from '../collections';
import { ProblemTypes } from '../constants';
import BaseEntityService from './base-entity-service';
import ProblemsService from './problems-service';

if (Meteor.isServer) {
  // import RiskWorkflow from '/imports/core/workflow/server/RiskWorkflow.js';
}


export default Object.assign({}, ProblemsService, {
  collection: Risks,

  _service: new BaseEntityService(Risks),

  _docType: ProblemTypes.RISK,

  _getAbbr: () => 'RK',

  'scores.insert': function ({ _id, ...args }) {
    const id = Random.id();
    const query = { _id };
    const options = {
      $addToSet: {
        scores: { _id: id, ...args },
      },
    };

    this.collection.update(query, options);

    return id;
  },

  'scores.remove': function ({ _id, score }) {
    const query = { _id };
    const options = {
      $pull: {
        scores: score,
      },
    };

    return this.collection.update(query, options);
  },

  _getDoc(_id) {
    const risk = this.collection.findOne({ _id });
    if (!risk) {
      throw new Meteor.Error(400, 'Risk does not exist');
    }
    return risk;
  },

  _refreshStatus(_id) {
    /* Meteor.isServer && Meteor.defer(() => {
      new RiskWorkflow(_id).refreshStatus();
    }); */
  },
});
