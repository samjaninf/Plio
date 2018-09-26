import { __setupDB, __closeDB } from 'meteor/mongo';
import faker from 'faker';

import createContext from '../../../utils/tests/createContext';
import { generateSerialNumber } from '../../../helpers';
import CustomerElementService from '../CustomerElementService';

jest.mock('../../../helpers', () => ({
  generateSerialNumber: jest.fn(() => 1),
}));

describe('Customer element service', () => {
  let context;

  beforeAll(async () => {
    await __setupDB();

    context = createContext({});
    CustomerElementService.collection = jest.fn(() => context.collections.Benefits);
    context.services.RelationService.deleteByDocumentId = jest.fn(() => true);
  });
  afterAll(__closeDB);

  test('insert', async () => {
    const args = {
      organizationId: faker.random.uuid(),
      title: faker.random.word(),
      description: faker.random.words(),
      importance: faker.random.number(),
      linkedTo: [{
        documentId: faker.random.uuid(),
        documentType: faker.random.word(),
      }],
    };
    const _id = await CustomerElementService.insert(args, context);
    const benefit = await context.collections.Benefits.findOne({ _id });

    expect(_id).toEqual(expect.any(String));
    expect(CustomerElementService.collection).toHaveBeenCalledWith(context);
    expect(generateSerialNumber).toHaveBeenCalledWith(
      context.collections.Benefits,
      { organizationId: args.organizationId },
    );
    expect(benefit).toEqual({
      ...args,
      _id,
      serialNumber: 1,
      createdBy: context.userId,
    });
  });

  test('update', async () => {
    const { _id } = await context.collections.Benefits.findOne({});
    const args = {
      _id,
      title: faker.random.word(),
      description: faker.random.words(),
      importance: faker.random.number(),
    };

    await CustomerElementService.update(args, context);

    const benefit = await context.collections.Benefits.findOne({ _id });

    expect(benefit).toEqual({
      ...benefit,
      ...args,
      updatedBy: context.userId,
    });
  });

  test('delete', async () => {
    const { _id } = await context.collections.Benefits.findOne({});
    const args = { _id };

    await CustomerElementService.delete(args, context);

    const benefit = await context.collections.Benefits.findOne({ _id });

    expect(benefit).toBe(null);
    expect(context.services.RelationService.deleteByDocumentId)
      .toBeCalledWith({ documentId: _id }, context);
  });
});
