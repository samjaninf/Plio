import { __setupDB, __closeDB } from 'meteor/mongo';
import faker from 'faker';

import { CanvasColors, CanvasTypes } from '../../../constants';
import createContext from '../../../utils/tests/createContext';
import insert from '../insert';

describe('ValuePropositionService.insert', () => {
  let context;

  beforeAll(async () => {
    await __setupDB();
    context = createContext({});
  });
  afterAll(__closeDB);

  it('inserts value proposition and matches customer segment to it', async () => {
    const customerSegmentId = await context.collections.CustomerSegments.insert({});
    const args = {
      title: faker.random.word(),
      organizationId: faker.random.number(),
      color: faker.random.objectElement(CanvasColors),
      originatorId: context.userId,
      notes: faker.random.words(),
      matchedTo: {
        documentId: customerSegmentId,
        documentType: CanvasTypes.CUSTOMER_SEGMENT,
      },
    };

    const _id = await insert(args, context);
    const valueProposition = await context.collections.ValuePropositions.findOne({ _id });
    const customerSegment = await context.collections.CustomerSegments.findOne({
      _id: customerSegmentId,
    });

    expect(valueProposition).toEqual({
      ...args,
      _id,
      createdBy: context.userId,
    });
    expect(context.collections.CustomerSegments.update).toHaveBeenCalledTimes(1);
    expect(customerSegment).toEqual({
      _id: customerSegmentId,
      matchedTo: {
        documentId: _id,
        documentType: CanvasTypes.VALUE_PROPOSITION,
      },
    });
  });
});
