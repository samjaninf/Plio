import { __setupDB, __closeDB, Mongo } from 'meteor/mongo';

import { CRITICALITY_DEFAULT, CanvasColors } from '../../constants';
import KeyPartnerService from '../key-partner-service';

describe('Key partner service', () => {
  let KeyPartners;

  beforeAll(__setupDB);
  afterAll(__closeDB);

  beforeEach(() => {
    KeyPartners = new Mongo.Collection('KeyPartners');
  });

  test('insert', async () => {
    const userId = 2;
    const args = {
      title: 'Hello World',
      organizationId: 1,
      originatorId: userId,
      color: CanvasColors.INDIGO,
      criticality: CRITICALITY_DEFAULT,
      levelOfSpend: CRITICALITY_DEFAULT,
      notes: 'dlsadsad',
    };
    const context = {
      userId,
      collections: { KeyPartners },
    };

    const _id = await KeyPartnerService.insert(args, context);
    const keyPartner = await KeyPartners.findOne({ _id });

    expect(keyPartner).toMatchObject({
      ...args,
      createdBy: userId,
    });
  });
});
