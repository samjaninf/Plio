import { __setupDB, __closeDB } from 'meteor/mongo';
import faker from 'faker';

import { CanvasColors, CanvasTypes } from '../../../constants';
import createContext from '../../../utils/tests/createContext';
import insert from '../insert';

describe('CustomerSegmentService.insert', () => {
  let context;

  beforeAll(async () => {
    await __setupDB();
    context = createContext({});
  });
  afterAll(__closeDB);

  it('inserts customer segment and matches value proposition to it', async () => {
    const valuePropositionId = await context.collections.ValuePropositions.insert({});
    const args = {
      title: faker.random.word(),
      organizationId: faker.random.number(),
      color: faker.random.objectElement(CanvasColors),
      originatorId: context.userId,
      notes: faker.random.words(),
      percentOfMarketSize: faker.random.number({ min: 0, max: 100 }),
      matchedTo: {
        documentId: valuePropositionId,
        documentType: CanvasTypes.VALUE_PROPOSITION,
      },
    };

    const _id = await insert(args, context);
    const customerSegment = await context.collections.CustomerSegments.findOne({ _id });
    const valueProposition = await context.collections.ValuePropositions.findOne({
      _id: valuePropositionId,
    });

    expect(customerSegment).toEqual({
      ...args,
      _id,
      createdBy: context.userId,
    });
    expect(context.collections.ValuePropositions.update).toHaveBeenCalledTimes(1);
    expect(valueProposition).toEqual({
      _id: valuePropositionId,
      matchedTo: {
        documentId: _id,
        documentType: CanvasTypes.CUSTOMER_SEGMENT,
      },
    });
  });
});
