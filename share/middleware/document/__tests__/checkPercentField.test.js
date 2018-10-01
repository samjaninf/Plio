import { __setupDB, __closeDB, Mongo } from 'meteor/mongo';
import faker from 'faker';
import { T } from 'ramda';

import checkPercentField from '../checkPercentField';

describe('checkPercentField', () => {
  const percentOfTotalCostErrorText = 'Cost lines cannot add up to more than 100%.' +
    '\nPlease reduce one or more values.';
  const organizationId = faker.random.uuid();
  let context = {};
  let config;
  let CostLines;
  let costLineId;

  beforeAll(async () => {
    await __setupDB();
    CostLines = new Mongo.Collection('CostLines');
    context = {
      userId: faker.random.uuid(),
      collections: { CostLines },
    };
    config = async (root, args, { collections }) => ({
      collection: collections.CostLines,
      key: 'percentOfTotalCost',
      entityName: 'Cost lines',
    });
    await CostLines.insert({ percentOfTotalCost: 50, organizationId });
    costLineId = await CostLines.insert({ percentOfTotalCost: 50, organizationId });
  });

  afterAll(__closeDB);

  it('throws if no collection provided', async () => {
    const args = { organizationId };
    const promise = checkPercentField()(T, {}, args, context);
    await expect(promise).rejects.toEqual(new Error('collection, key or entityName is required'));
  });

  it('passes if new percent and current percent are undefined', async () => {
    const args = { organizationId };
    const result = await checkPercentField(config)(T, {}, args, context);
    expect(result).toBe(true);
  });

  it('passes if new percent is undefined', async () => {
    const args = { organizationId };
    const root = { percentOfTotalCost: 10 };
    const result = await checkPercentField(config)(T, root, args, context);
    expect(result).toBe(true);
  });

  it('passes if current percent is equal to new percent', async () => {
    const root = { percentOfTotalCost: 10 };
    const args = { organizationId, percentOfTotalCost: 10 };
    const result = await checkPercentField(config)(T, root, args, context);
    expect(result).toBe(true);
  });

  it('passes if new percent is lower then current percent', async () => {
    const root = { percentOfTotalCost: 10 };
    const args = { organizationId, percentOfTotalCost: 5 };
    const result = await checkPercentField(config)(T, root, args, context);
    expect(result).toBe(true);
  });

  it('throws if current percent is undefined and total percent is exceeded', async () => {
    const args = { organizationId, percentOfTotalCost: 5 };
    const promise = checkPercentField(config)(T, {}, args, context);

    await expect(promise).rejects.toEqual(new Error(percentOfTotalCostErrorText));
  });

  it('throws if total percent is exceeded', async () => {
    const root = { percentOfTotalCost: 5 };
    const args = { organizationId, percentOfTotalCost: 10 };
    const promise = checkPercentField(config)(T, root, args, context);

    await expect(promise).rejects.toEqual(new Error(percentOfTotalCostErrorText));
  });

  it('passes if current percent is lower then new ' +
    'percent and total percent is not exceeded', async () => {
    const root = { percentOfTotalCost: 5 };
    const args = { organizationId, percentOfTotalCost: 10 };
    await CostLines.remove({ _id: costLineId });
    const result = await checkPercentField(config)(T, root, args, context);
    expect(result).toBe(true);
  });

  it('passes if current percent is undefined and total percent is not exceeded', async () => {
    const args = { organizationId, percentOfTotalCost: 10 };
    const result = await checkPercentField(config)(T, {}, args, context);
    expect(result).toBe(true);
  });
});
