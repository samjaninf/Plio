import { __setupDB, __closeDB } from 'meteor/mongo';
import faker from 'faker';

import createContext from '../../../utils/tests/createContext';
import unmatch from '../unmatch';
import { CanvasTypes } from '../../../constants';

describe('ValuePropositionService.unmatch', () => {
  let context;

  beforeAll(async () => {
    await __setupDB();
    context = createContext({});
  });
  afterAll(__closeDB);

  test('unmatch', async () => {
    const valuePropositionId = faker.random.uuid();
    const customerSegmentData = {
      matchedTo: {
        documentId: valuePropositionId,
        documentType: CanvasTypes.VALUE_PROPOSITION,
      },
    };
    const customerSegmentId = await context.collections.CustomerSegments.insert(
      customerSegmentData,
    );

    await unmatch({ _id: valuePropositionId }, context);

    const customerSegment = await context.collections.CustomerSegments.findOne({
      _id: customerSegmentId,
    });
    expect(customerSegment).toEqual({ _id: customerSegmentId });
  });
});
