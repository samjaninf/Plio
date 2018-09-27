import { __setupDB, __closeDB } from 'meteor/mongo';

import createContext from '../../../utils/tests/createContext';
import deleteValueProposition from '../delete';
import unmatch from '../unmatch';
import deleteRelations from '../deleteRelations';

jest.mock('../unmatch');
jest.mock('../deleteRelations');

describe('ValuePropositionService.delete', () => {
  let context;

  beforeAll(async () => {
    await __setupDB();
    context = createContext({});
  });
  afterAll(__closeDB);

  test('delete', async () => {
    const _id = await context.collections.ValuePropositions.insert({});
    const args = { _id };
    const linkedTo = { documentId: _id };
    const benefitId = await context.collections.Benefits.insert({ linkedTo });
    const featureId = await context.collections.Features.insert({ linkedTo });
    await deleteValueProposition(args, context);
    const benefit = await context.collections.Benefits.findOne({ _id: benefitId });
    const feature = await context.collections.Features.findOne({ _id: featureId });

    expect(context.collections.ValuePropositions.remove).toHaveBeenCalledWith({ _id });
    expect(unmatch).toHaveBeenCalledWith(args, context);
    expect(deleteRelations).toHaveBeenCalledWith(args, context);
    expect(context.collections.Benefits.remove).toBeCalled();
    expect(context.collections.Features.remove).toBeCalled();
    expect(benefit).toBeNull();
    expect(feature).toBeNull();
  });
});
