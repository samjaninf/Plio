import { __setupDB, __closeDB } from 'meteor/mongo';

import createContext from '../../../utils/tests/createContext';
import deleteCustomerSegment from '../delete';
import unmatch from '../unmatch';
import deleteRelations from '../deleteRelations';

jest.mock('../unmatch');
jest.mock('../deleteRelations');

describe('CustomerSegmentService.delete', () => {
  let context;

  beforeAll(async () => {
    await __setupDB();
    context = createContext({});
  });
  afterAll(__closeDB);

  test('delete', async () => {
    const _id = await context.collections.CustomerSegments.insert({});
    const args = { _id };
    const linkedTo = { documentId: _id };
    const needId = await context.collections.Needs.insert({ linkedTo });
    const wantId = await context.collections.Wants.insert({ linkedTo });
    await deleteCustomerSegment(args, context);
    const need = await context.collections.Needs.findOne({ _id: needId });
    const want = await context.collections.Wants.findOne({ _id: wantId });

    expect(context.collections.CustomerSegments.remove).toHaveBeenCalledWith({ _id });
    expect(unmatch).toHaveBeenCalledWith(args, context);
    expect(deleteRelations).toHaveBeenCalledWith(args, context);
    expect(context.collections.Needs.remove).toBeCalled();
    expect(context.collections.Wants.remove).toBeCalled();
    expect(need).toBeNull();
    expect(want).toBeNull();
  });
});
