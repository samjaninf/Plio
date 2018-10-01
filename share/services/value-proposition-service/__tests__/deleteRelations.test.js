import { __setupDB, __closeDB } from 'meteor/mongo';

import createContext from '../../../utils/tests/createContext';
import deleteRelations from '../deleteRelations';

describe('ValuePropositionService.deleteRelations', () => {
  let context;

  beforeAll(async () => {
    await __setupDB();
    context = createContext({});
  });
  afterAll(__closeDB);

  test('deleteRelations', async () => {
    const _id = await context.collections.ValuePropositions.insert({});
    const args = { _id };
    const linkedTo = { documentId: _id };

    const benefitId = await context.collections.Benefits.insert({ linkedTo });
    const featureId = await context.collections.Features.insert({ linkedTo });
    const relationId = await context.collections.Relations.insert({
      rel1: { documentId: benefitId },
      rel2: { documentId: featureId },
    });
    await deleteRelations(args, context);
    const benefit = await context.collections.Benefits.findOne({ _id: benefitId });
    const feature = await context.collections.Features.findOne({ _id: featureId });
    const relation = await context.collections.Relations.findOne({ _id: relationId });

    expect(context.collections.Benefits.find).toBeCalled();
    expect(context.collections.Features.find).toBeCalled();
    expect(context.collections.Relations.remove).toBeCalled();
    expect(benefit).not.toBeNull();
    expect(feature).not.toBeNull();
    expect(relation).toBeNull();
  });
});
