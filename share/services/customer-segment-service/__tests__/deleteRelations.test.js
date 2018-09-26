import { __setupDB, __closeDB } from 'meteor/mongo';

import createContext from '../../../utils/tests/createContext';
import deleteRelations from '../deleteRelations';

describe('CustomerSegmentService.deleteRelations', () => {
  let context;

  beforeAll(async () => {
    await __setupDB();
    context = createContext({});
  });
  afterAll(__closeDB);

  test('deleteRelations', async () => {
    const _id = await context.collections.CustomerSegments.insert({});
    const args = { _id };
    const linkedTo = { documentId: _id };

    const needId = await context.collections.Needs.insert({ linkedTo });
    const wantId = await context.collections.Wants.insert({ linkedTo });
    const relationId = await context.collections.Relations.insert({
      rel1: { documentId: needId },
      rel2: { documentId: wantId },
    });
    await deleteRelations(args, context);
    const need = await context.collections.Needs.findOne({ _id: needId });
    const want = await context.collections.Wants.findOne({ _id: wantId });
    const relation = await context.collections.Relations.findOne({ _id: relationId });

    expect(context.collections.Needs.find).toBeCalled();
    expect(context.collections.Wants.find).toBeCalled();
    expect(context.collections.Relations.remove).toBeCalled();
    expect(need).not.toBeNull();
    expect(want).not.toBeNull();
    expect(relation).toBeNull();
  });
});
