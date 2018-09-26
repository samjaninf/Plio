import { __setupDB, __closeDB } from 'meteor/mongo';
import faker from 'faker';

import createContext from '../../../utils/tests/createContext';
import deleteRelations from '../deleteRelations';
import unmatch from '../unmatch';
import match from '../match';
import { CanvasTypes } from '../../../constants';

jest.mock('../unmatch');
jest.mock('../deleteRelations');

describe('ValuePropositionService.match', () => {
  let context;

  beforeAll(async () => {
    await __setupDB();
    context = createContext({});
  });
  afterAll(__closeDB);
  beforeEach(() => {
    context.collections.CustomerSegments.update.mockClear();
  });

  it('matches value proposition to customer segment', async () => {
    const customerSegmentId = await context.collections.CustomerSegments.insert({});
    const _id = await context.collections.ValuePropositions.insert({});
    const args = {
      _id,
      matchedTo: {
        documentId: customerSegmentId,
        documentType: CanvasTypes.CUSTOMER_SEGMENT,
      },
    };

    await match(args, context);

    const valueProposition = await context.collections.ValuePropositions.findOne({ _id });
    const customerSegment = await context.collections.CustomerSegments.findOne({
      _id: customerSegmentId,
    });

    expect(deleteRelations).toHaveBeenCalled();
    expect(unmatch).toHaveBeenCalled();
    expect(valueProposition).toEqual(args);
    expect(context.collections.CustomerSegments.update).toHaveBeenCalledTimes(1);
    expect(customerSegment).toEqual({
      _id: customerSegmentId,
      matchedTo: {
        documentId: _id,
        documentType: CanvasTypes.VALUE_PROPOSITION,
      },
    });
  });

  it('matches value proposition to nothing', async () => {
    const _id = await context.collections.ValuePropositions.insert({
      matchedTo: {
        documentId: faker.random.uuid(),
        documentType: CanvasTypes.CUSTOMER_SEGMENT,
      },
    });
    const args = {
      _id,
      matchedTo: null,
    };

    await match(args, context);

    const valueProposition = await context.collections.ValuePropositions.findOne({ _id });

    expect(deleteRelations).toHaveBeenCalled();
    expect(unmatch).toHaveBeenCalled();
    expect(valueProposition).toEqual(args);
    expect(context.collections.CustomerSegments.update).toHaveBeenCalledTimes(0);
  });
});
