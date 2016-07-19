import { Risks } from './risks.js';
import { generateSerialNumber } from '/imports/core/utils.js';

export default {
  collection: Risks,

  insert({ organizationId, ...args }) {
    const serialNumber = Utils.generateSerialNumber(this.collection, { organizationId });

    const sequentialId = `RK${serialNumber}`;

    return this.collection.insert({ organizationId, serialNumber, sequentialId, ...args });
  },

  update({ _id, query = {}, options = {}, ...args }) {
    if (!_.keys(query).length > 0) {
      query = { _id };
    }
    if (!_.keys(options).length > 0) {
      options['$set'] = args;
    }

    return this.collection.update(query, options);
  },

  updateViewedBy({ _id, userId }) {
    const query = { _id };
    const options = {
      $addToSet: {
        viewedBy: userId
      }
    };

    return this.collection.update(query, options);
  },

  remove({ _id, deletedBy, isDeleted }) {
    const query = { _id };

    if (isDeleted) {
      return this.collection.remove(query);
    } else {
      const options = {
        $set: {
          isDeleted: true,
          deletedBy,
          deletedAt: new Date()
        }
      };

      return this.collection.update(query, options);
    }
  },

  'scores.insert'({ _id, ...args }) {
    const query = { _id };
    const options = {
      $addToSet: {
        scores: { ...args }
      }
    };

    return this.collection.update(query, options);
  },

  'scores.remove'({ _id, score }) {
    const query = { _id };
    const options = {
      '$pull': {
        'scores': score
      }
    };

    console.log(options);

    return this.collection.update(query, options);
  }
};
