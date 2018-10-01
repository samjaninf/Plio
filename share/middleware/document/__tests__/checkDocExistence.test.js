import { __setupDB, __closeDB, Mongo } from 'meteor/mongo';
import faker from 'faker';
import { identity } from 'ramda';

import Errors from '../../../errors';
import checkDocExistence from '../checkDocExistence';

describe('checkDocExistence', () => {
  let Organizations;
  let context = {};

  beforeAll(async () => {
    await __setupDB();
    Organizations = new Mongo.Collection('organizations');
    context = { userId: faker.random.uuid(), collections: { Organizations } };
  });

  afterAll(__closeDB);

  beforeEach(async () => {
    Organizations.remove({});
  });

  it('throws if no collection provided', async () => {
    const promise = checkDocExistence()(identity, {}, {}, context);

    await expect(promise).rejects.toEqual(new Error('entity or collection is required'));
  });

  it('throws if no entity found', async () => {
    await Organizations.insert({});

    const config = (root, args, { collections }) => ({ collection: collections.Organizations });
    const promise = checkDocExistence(config)(identity, {}, {}, context);

    await expect(promise).rejects.toEqual(new Error(Errors.NOT_FOUND));
  });

  it('throws a custom error message', async () => {
    const errorMessage = 'test error message';
    const config = (root, args, { collections }) => ({
      errorMessage,
      collection: collections.Organizations,
    });
    const promise = checkDocExistence(config)(identity, {}, {}, context);

    await expect(promise).rejects.toEqual(new Error(errorMessage));
  });

  it('passes if entity provided', async () => {
    const config = async (root, { _id }, { collections }) => ({
      entity: await collections.Organizations.findOne({ _id }),
    });
    const _id = await Organizations.insert({});
    const organization = await Organizations.findOne({ _id });
    const promise = checkDocExistence(config)(identity, {}, { _id }, context);

    await expect(promise).resolves.toEqual(organization);
  });

  it('passes with default config', async () => {
    const config = (root, args, { collections }) => ({
      collection: collections.Organizations,
    });
    const _id = await Organizations.insert({});
    const organization = await Organizations.findOne({ _id });
    const promise = checkDocExistence(config)(identity, {}, { _id }, context);

    await expect(promise).resolves.toEqual(organization);
  });

  it('passes if query provided', async () => {
    const serialNumber = faker.random.number();
    const config = (root, args, { collections }) => ({
      collection: collections.Organizations,
      query: { serialNumber },
    });

    const _id = await Organizations.insert({ serialNumber });
    const organization = await Organizations.findOne({ _id });

    const promise = checkDocExistence(config)(identity, {}, {}, context);

    await expect(promise).resolves.toEqual(organization);
  });
});
