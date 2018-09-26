import { mergeDeepRight, mapObjIndexed } from 'ramda';
import faker from 'faker';
import { Mongo } from 'meteor/mongo';
import sift from 'sift';

export default (ctx) => {
  const Collections = require('../../collections');
  const services = require('../../services');
  const collections = {
    ...mapObjIndexed((c, key) => new Mongo.Collection(key), Collections),
    Users: new Mongo.Collection('users'),
  };
  const loaders = {
    User: collections.Users,
    Organization: collections.Organizations,
    File: collections.Files,
    Risk: collections.Risks,
    Action: collections.Actions,
    Lesson: collections.LessonsLearned,
    Milestone: collections.Milestones,
    Goal: collections.Goals,
    RiskType: collections.RiskTypes,
    Standard: collections.Standards,
    Department: collections.Departments,
    ValueProposition: collections.ValuePropositions,
    CustomerSegment: collections.CustomerSegments,
    Benefit: collections.Benefits,
    Feature: collections.Features,
    Need: collections.Needs,
    Want: collections.Wants,
    Relation: collections.Relations,
  };
  const context = mergeDeepRight({
    userId: faker.random.uuid(),
    collections,
    services,
    loaders: Object.keys(loaders).reduce((acc, key) => {
      const collection = loaders[key];

      return {
        ...acc,
        [key]: {
          byId: {
            load: jest.fn(_id => collection.findOne({ _id })),
            loadMany: jest.fn(ids => collection.find({ _id: { $in: ids } }).fetch()),
          },
          byQuery: {
            load: jest.fn(query => collection.find(query).fetch()),
            loadMany: jest.fn((queries) => {
              const docs = collection.find({ $or: queries }).fetch();
              return queries.map(query => sift(query, docs));
            }),
          },
        },
      };
    }, {}),
  }, ctx);

  return context;
};
