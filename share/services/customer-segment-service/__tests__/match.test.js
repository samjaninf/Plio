import { __setupDB, __closeDB } from 'meteor/mongo';
import faker from 'faker';

import createContext from '../../../utils/tests/createContext';
import deleteRelations from '../deleteRelations';
import unmatch from '../unmatch';
import match from '../match';
import { CanvasTypes } from '../../../constants';

jest.mock('../unmatch');
jest.mock('../deleteRelations');

describe('CustomerSegmentService.match', () => {
  let context;

  beforeAll(async () => {
    await __setupDB();
    context = createContext({});
  });
  afterAll(__closeDB);
  beforeEach(() => {
    context.collections.ValuePropositions.update.mockClear();
  });

  it('matches customer segment to value proposition', async () => {
    const valuePropositionId = await context.collections.ValuePropositions.insert({});
    const _id = await context.collections.CustomerSegments.insert({});
    const args = {
      _id,
      matchedTo: {
        documentId: valuePropositionId,
        documentType: CanvasTypes.VALUE_PROPOSITION,
      },
    };

    await match(args, context);

    const customerSegment = await context.collections.CustomerSegments.findOne({ _id });
    const valueProposition = await context.collections.ValuePropositions.findOne({
      _id: valuePropositionId,
    });

    expect(deleteRelations).toHaveBeenCalled();
    expect(unmatch).toHaveBeenCalled();
    expect(customerSegment).toEqual(args);
    expect(context.collections.ValuePropositions.update).toHaveBeenCalledTimes(1);
    expect(valueProposition).toEqual({
      _id: valuePropositionId,
      matchedTo: {
        documentId: _id,
        documentType: CanvasTypes.CUSTOMER_SEGMENT,
      },
    });
  });

  it('matches customer segment to nothing', async () => {
    const _id = await context.collections.CustomerSegments.insert({
      matchedTo: {
        documentId: faker.random.uuid(),
        documentType: CanvasTypes.VALUE_PROPOSITION,
      },
    });
    const args = {
      _id,
      matchedTo: null,
    };

    await match(args, context);

    const customerSegment = await context.collections.CustomerSegments.findOne({ _id });

    expect(deleteRelations).toHaveBeenCalled();
    expect(unmatch).toHaveBeenCalled();
    expect(customerSegment).toEqual(args);
    expect(context.collections.ValuePropositions.update).toHaveBeenCalledTimes(0);
  });
});
