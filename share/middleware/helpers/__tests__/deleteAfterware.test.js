import { __setupDB, __closeDB, Mongo } from 'meteor/mongo';
import { T } from 'ramda';

import deleteAfterware from '../deleteAfterware';

describe('deleteAfterware', () => {
  let context = {};
  let costLineId;

  beforeAll(async () => {
    await __setupDB();
    const CostLines = new Mongo.Collection('CostLines');
    context = { collections: { CostLines } };
    costLineId = await CostLines.insert();
  });

  afterAll(__closeDB);

  it('throws if no collection provided', async () => {
    const args = { _id: costLineId };
    const promise = deleteAfterware()(T, {}, args, context);
    await expect(promise).rejects.toEqual(new Error('collection is required'));
  });

  it('passes if query provided', async () => {
    const config = async (root, args, { collections }) => ({
      collection: collections.CostLines,
      query: { _id: costLineId },
    });
    const result = await deleteAfterware(config)(T, {}, {}, context);
    expect(result._id).toBe(costLineId);
  });

  it('passes if no query provided', async () => {
    const args = { _id: costLineId };
    const config = async (root, arg, { collections }) => ({
      collection: collections.CostLines,
    });
    const result = await deleteAfterware(config)(T, {}, args, context);
    expect(result._id).toBe(costLineId);
  });
});
