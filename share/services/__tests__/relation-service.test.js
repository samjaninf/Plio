import { __setupDB, __closeDB } from 'meteor/mongo';
import faker from 'faker';

import createContext from '../../utils/tests/createContext';
import RelationService from '../relation-service';

describe('Customer element service', () => {
  let context;
  const insertArgs = {
    rel1: {
      documentId: faker.random.uuid(),
      documentType: faker.random.word(),
    },
    rel2: {
      documentId: faker.random.uuid(),
      documentType: faker.random.word(),
    },
  };

  beforeAll(async () => {
    await __setupDB();

    context = createContext({});
  });
  afterAll(__closeDB);
  beforeEach(async () => context.collections.Relations.remove({}));

  test('insert', async () => {
    const _id = await RelationService.insert(insertArgs, context);
    const relation = await context.collections.Relations.findOne({ _id });

    expect(_id).toEqual(expect.any(String));
    expect(relation).toEqual({
      ...insertArgs,
      _id,
      createdBy: context.userId,
    });
  });

  test('delete', async () => {
    const _id = await RelationService.insert(insertArgs, context);
    let relation = await context.collections.Relations.findOne({ _id });
    const { rel1, rel2 } = relation;
    const args = {
      rel1: { documentId: rel1.documentId },
      rel2: { documentId: rel2.documentId },
    };

    await RelationService.delete(args, context);

    relation = await context.collections.Relations.findOne({ _id });

    expect(relation).toBe(null);
  });

  test('delete (reverse args)', async () => {
    const _id = await RelationService.insert(insertArgs, context);
    let relation = await context.collections.Relations.findOne({ _id });
    const { rel1, rel2 } = relation;
    const args = {
      rel1: { documentId: rel2.documentId },
      rel2: { documentId: rel1.documentId },
    };

    await RelationService.delete(args, context);

    relation = await context.collections.Relations.findOne({ _id });

    expect(relation).toBe(null);
  });

  test('deleteByDocumentId', async () => {
    const _id = await RelationService.insert(insertArgs, context);
    const { rel1: { documentId } } = await context.collections.Relations.findOne({ _id });
    const args = { documentId };

    await RelationService.deleteByDocumentId(args, context);

    const relation = await context.collections.Relations.findOne({ _id });

    expect(relation).toBe(null);
  });
});
