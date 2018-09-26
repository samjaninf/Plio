import { __setupDB, __closeDB } from 'meteor/mongo';
import faker from 'faker';

import createContext from '../../../utils/tests/createContext';
import unmatch from '../unmatch';
import { CanvasTypes } from '../../../constants';

describe('CustomerSegmentService.unmatch', () => {
  let context;

  beforeAll(async () => {
    await __setupDB();
    context = createContext({});
  });
  afterAll(__closeDB);

  test('unmatch', async () => {
    const customerSegmentId = faker.random.uuid();
    const valuePropositionData = {
      matchedTo: {
        documentId: customerSegmentId,
        documentType: CanvasTypes.CUSTOMER_SEGMENT,
      },
    };
    const valuePropositionId = await context.collections.ValuePropositions.insert(
      valuePropositionData,
    );

    await unmatch({ _id: customerSegmentId }, context);

    const valueProposition = await context.collections.ValuePropositions.findOne({
      _id: valuePropositionId,
    });
    expect(valueProposition).toEqual({ _id: valuePropositionId });
  });
});
