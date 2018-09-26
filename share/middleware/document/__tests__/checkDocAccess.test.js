import { __setupDB, __closeDB, Mongo } from 'meteor/mongo';
import faker from 'faker';
import { identity } from 'ramda';

import checkDocAccess from '../checkDocAccess';

describe('checkDocAccess', () => {
  let context = {};

  beforeAll(async () => {
    await __setupDB();
    const Organizations = new Mongo.Collection('Organizations');
    const Standards = new Mongo.Collection('Standards');
    context = {
      userId: faker.random.uuid(),
      collections: { Organizations, Standards },
    };
  });

  afterAll(__closeDB);

  beforeEach(async () => {
    await Promise.all(Object.values(context.collections).map(collection => collection.remove({})));
  });

  it('passes', async () => {
    const organizationId = await context.collections.Organizations.insert({
      users: [{ userId: context.userId, isRemoved: false }],
    });
    const _id = await context.collections.Standards.insert({ organizationId });
    const standard = await context.collections.Standards.findOne({ _id });
    const config = jest.fn((root, args, { collections: { Standards } }) => ({
      collection: Standards,
    }));
    const promise = checkDocAccess(config)(identity, {}, { _id }, context);

    await expect(promise).resolves.toEqual(standard);

    expect(config).toHaveBeenCalledTimes(1);
    expect(config).toHaveBeenCalledWith({}, { _id }, context);
  });
});
