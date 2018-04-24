import { __setupDB, __closeDB, Mongo } from 'meteor/mongo';

describe('Milestone service', () => {
  beforeAll(__setupDB);
  afterAll(__closeDB);

  beforeEach(() => {
    jest.doMock('../../collections', () => ({
      Goals: new Mongo.Collection('goals'),
      Milestones: new Mongo.Collection('milestones'),
    }));
  });

  test('insert', async () => {
    const MilestoneService = require('../milestone-service').default;
    const { Goals } = require('../../collections');
    const organizationId = 1;
    const goalId = 2;
    const args = {
      organizationId,
      title: 'hello',
      description: 'world',
      completionTargetDate: new Date(),
      linkedTo: goalId,
    };

    await Goals.insert({ _id: goalId });

    const { milestone } = await MilestoneService.insert(args);
    const { milestoneIds } = await Goals.findOne({ _id: goalId });

    expect(milestone).toMatchObject(args);
    expect(milestoneIds).toContain(milestone._id);
  });

  test('delete', async () => {
    const MilestoneService = require('../milestone-service').default;
    const args = {
      organizationId: 2,
      title: 'hello',
      description: 'world',
      completionTargetDate: new Date(),
      linkedTo: 3,
    };
    const context = { userId: 4 };
    const { milestone: { _id } } = await MilestoneService.insert(args);
    const { milestone } = await MilestoneService.delete({ _id }, context);

    expect(milestone).toMatchObject({
      isDeleted: true,
      deletedBy: context.userId,
      deletedAt: expect.any(Date),
    });
  });

  test('complete', async () => {
    const MilestoneService = require('../milestone-service').default;
    const context = { userId: 1 };
    const { milestone: { _id } } = await MilestoneService.insert({});
    const { milestone } = await MilestoneService.complete({ _id }, context);

    expect(milestone).toMatchObject({
      isCompleted: true,
      completedBy: context.userId,
      completedAt: expect.any(Date),
    });
  });
});