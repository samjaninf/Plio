import { __setupDB, __closeDB } from 'meteor/mongo';
import faker from 'faker';

import createContext from '../../../../../share/utils/tests/createContext';
import { createRelationResolver, resolveCustomerElementStatus } from '../util';
import { CustomerElementTypes, CustomerElementStatuses } from '../../../../../share/constants';

describe('resolvers/util', () => {
  let context;
  let benefitId;
  let needId;

  beforeAll(async () => {
    await __setupDB();

    context = createContext({});

    needId = await context.collections.Needs.insert({});
    benefitId = await context.collections.Benefits.insert({});

    await context.collections.Relations.insert({
      rel1: {
        documentId: needId,
        documentType: CustomerElementTypes.NEED,
      },
      rel2: {
        documentId: benefitId,
        documentType: CustomerElementTypes.BENEFIT,
      },
    });
  });
  afterAll(__closeDB);

  describe('createRelationResolver', () => {
    it('throws if no documentType and loader provided', async () => {
      const promise = createRelationResolver(() => ({}))({}, {}, context);
      await expect(promise).rejects.toEqual(expect.any(Error));
    });

    it('returns benefit that is matched to need', async () => {
      const config = (root, args, { loaders: { Benefit: { byId } } }) => ({
        documentType: CustomerElementTypes.BENEFIT,
        loader: byId,
      });
      const root = { _id: needId };
      const promise = createRelationResolver(config)(root, {}, context);
      const benefit = await context.collections.Benefits.findOne({ _id: benefitId });

      await expect(promise).resolves.toEqual([benefit]);
    });

    it('returns need that is matched to benefit', async () => {
      const config = (root, args, { loaders: { Need: { byId } } }) => ({
        documentType: CustomerElementTypes.NEED,
        loader: byId,
      });
      const root = { _id: benefitId };
      const promise = createRelationResolver(config)(root, {}, context);
      const need = await context.collections.Needs.findOne({ _id: needId });

      await expect(promise).resolves.toEqual([need]);
    });
  });

  describe('resolveCustomerElementStatus', () => {
    it('returns unmatched status', async () => {
      const root = { _id: faker.random.uuid() };
      const promise = resolveCustomerElementStatus(root, {}, context);

      expect(context.loaders.Relation.byQuery.load).toBeCalled();
      await expect(promise).resolves.toBe(CustomerElementStatuses.UNMATCHED);
    });

    it('returns matched status', async () => {
      const root = { _id: benefitId };
      const promise = resolveCustomerElementStatus(root, {}, context);

      expect(context.loaders.Relation.byQuery.load).toBeCalled();
      await expect(promise).resolves.toBe(CustomerElementStatuses.MATCHED);
    });
  });
});
