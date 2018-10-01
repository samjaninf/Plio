import { __setupDB, __closeDB, Mongo } from 'meteor/mongo';
import { T, nthArg, times } from 'ramda';
import faker from 'faker';

import Errors from '../../../errors';

import checkOrgMembership from '../checkOrgMembership';

describe('checkOrgMembership', () => {
  let Organizations;

  beforeAll(__setupDB);

  afterAll(__closeDB);

  beforeEach(async () => {
    Organizations = new Mongo.Collection('Organizations');
    await Organizations.remove({});
  });

  it('throws if no organization with provided id exists', async () => {
    const root = {};
    const args = { organizationId: 1 };
    const context = { userId: 2, collections: { Organizations } };

    const promise = checkOrgMembership()(T, root, args, context);

    await expect(promise).rejects.toEqual(new Error(Errors.NOT_ORG_MEMBER));
  });

  it('throws if current user is not organization member', async () => {
    const root = {};
    const args = { organizationId: 1 };
    const context = { userId: 2, collections: { Organizations } };

    await Organizations.insert({ _id: args.organizationId });

    const promise = checkOrgMembership()(T, root, args, context);

    await expect(promise).rejects.toEqual(new Error(Errors.NOT_ORG_MEMBER));
  });

  it('throws if user is not organization member', async () => {
    const root = {};
    const args = { organizationId: 1, userId: 3 };
    const context = { userId: 2, collections: { Organizations } };

    await Organizations.insert({ _id: args.organizationId });

    const promise = checkOrgMembership((_, { userId }) => ({ userId }))(T, root, args, context);

    await expect(promise).rejects.toEqual(new Error(Errors.USER_NOT_ORG_MEMBER));
  });

  it('passes with default config', async () => {
    const root = {};
    const args = { organizationId: 1 };
    const context = { userId: 2, collections: { Organizations } };

    await Organizations.insert({
      _id: args.organizationId,
      users: [{ userId: context.userId, isRemoved: false }],
    });

    const promise = checkOrgMembership()(T, root, args, context);

    await expect(promise).resolves.toBe(true);
  });

  it('passes if only organizationId provided', async () => {
    const root = {};
    const args = { organizationId: 1 };
    const context = { userId: 2, collections: { Organizations } };

    await Organizations.insert({
      _id: args.organizationId,
      users: [{ userId: context.userId, isRemoved: false }],
    });

    const promise = checkOrgMembership(
      (_, { organizationId }) => ({ organizationId }),
    )(T, root, args, context);

    await expect(promise).resolves.toBe(true);
  });

  it('passes if only userId provided', async () => {
    const root = {};
    const args = { organizationId: 1, userId: 3 };
    const context = { userId: 2, collections: { Organizations } };

    await Organizations.insert({
      _id: args.organizationId,
      users: [{ userId: args.userId, isRemoved: false }],
    });

    const promise = checkOrgMembership(
      (_, { userId }) => ({ userId }),
    )(T, root, args, context);

    await expect(promise).resolves.toBe(true);
  });

  it('passes if only serialNumber provided', async () => {
    const root = {};
    const args = { serialNumber: 1 };
    const context = { userId: 2, collections: { Organizations } };

    await Organizations.insert({
      serialNumber: args.serialNumber,
      users: [{ userId: context.userId, isRemoved: false }],
    });

    const promise = checkOrgMembership(
      (_, { serialNumber }) => ({ serialNumber }),
    )(T, root, args, context);

    await expect(promise).resolves.toBe(true);
  });

  it('passes if both organizationId and userId provided', async () => {
    const root = {};
    const args = { organizationId: 1, userId: 3 };
    const context = { userId: 2, collections: { Organizations } };

    await Organizations.insert({
      _id: args.organizationId,
      users: [{ userId: args.userId, isRemoved: false }],
    });
    const organization = await Organizations.findOne({ _id: args.organizationId });

    const promise = checkOrgMembership(
      (_, { organizationId, userId }) => ({ organizationId, userId }),
    )(nthArg(2), root, args, context);

    await expect(promise).resolves.toMatchObject({ organization });
  });

  it('fetches the correct organization', async () => {
    const userId = faker.random.uuid();
    const root = {};
    const args = { serialNumber: 2, organizationId: undefined };
    const context = { userId, collections: { Organizations } };

    await Promise.all(times(n => Organizations.insert({
      serialNumber: n,
      users: [{ userId, isRemoved: false }],
    }), 3));
    const organization = await Organizations.findOne({ serialNumber: args.serialNumber });
    const config = (_, { serialNumber, organizationId }) => ({ serialNumber, organizationId });
    const promise = checkOrgMembership(config)(nthArg(2), root, args, context);

    await expect(promise).resolves.toMatchObject({ organization });
  });
});
