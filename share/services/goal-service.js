import { getIds } from 'plio-util';

import { Goals } from '../collections';
import { generateSerialNumber } from '../helpers';
import { Abbreviations } from '../constants';
import MilestoneService from './milestone-service';

export default {
  collection: Goals,

  async insert({
    organizationId,
    title,
    description,
    ownerId,
    startDate,
    endDate,
    color,
    priority,
  }) {
    const serialNumber = generateSerialNumber(this.collection, { organizationId });
    const sequentialId = `${Abbreviations.GOAL}${serialNumber}`;

    return this.collection.insert({
      organizationId,
      title,
      description,
      ownerId,
      startDate,
      endDate,
      color,
      serialNumber,
      sequentialId,
      priority,
    });
  },

  update(args, context) {
    const {
      _id,
      title,
      description,
      ownerId,
      startDate,
      endDate,
      priority,
      color,
      statusComment,
      completionComment,
      completedAt,
      completedBy,
      riskIds,
      milestoneIds,
      notify,
      fileIds,
    } = args;
    const { collections } = context;
    const query = { _id };
    const modifier = {
      $set: {
        title,
        description,
        ownerId,
        startDate,
        endDate,
        priority,
        color,
        statusComment,
        completionComment,
        completedAt,
        completedBy,
        riskIds,
        milestoneIds,
        notify,
        fileIds,
      },
    };

    return collections.Goals.update(query, modifier);
  },

  async complete({ _id, completionComment }, { userId }) {
    return this.set({
      _id,
      completionComment,
      isCompleted: true,
      completedBy: userId,
      completedAt: new Date(),
    });
  },

  async undoCompletion({ _id }) {
    const query = { _id };
    const modifier = {
      $set: {
        isCompleted: false,
      },
      $unset: {
        completedBy: '',
        completedAt: '',
        completionComment: '',
      },
    };

    return this.collection.update(query, modifier);
  },

  async linkMilestone({ _id, milestoneId }) {
    const query = { _id };
    const modifier = {
      $addToSet: {
        milestoneIds: milestoneId,
      },
    };

    return this.collection.update(query, modifier);
  },

  async linkRisk({ _id, riskId }) {
    const query = { _id };
    const modifier = {
      $addToSet: {
        riskIds: riskId,
      },
    };

    return this.collection.update(query, modifier);
  },

  async linkFile({ _id, fileId }) {
    const query = { _id };
    const modifier = {
      $addToSet: {
        fileIds: fileId,
      },
    };

    return this.collection.update(query, modifier);
  },

  async unlinkFile({ _id, fileId }) {
    const query = { _id };
    const modifier = {
      $pull: {
        fileIds: fileId,
      },
    };

    return this.collection.update(query, modifier);
  },

  async addToNotify({ _id, userId }) {
    const query = { _id };
    const modifier = {
      $addToSet: {
        notify: userId,
      },
    };

    return this.collection.update(query, modifier);
  },

  async removeFromNotify({ _id, userId }) {
    const query = { _id };
    const modifier = {
      $pull: {
        notify: userId,
      },
    };

    return this.collection.update(query, modifier);
  },

  async deleteMilestones({ milestoneIds = [] }, { userId }) {
    return Promise.all(milestoneIds.map(milestoneId =>
      MilestoneService.delete({ _id: milestoneId }, { userId })));
  },

  async removeMilestones({ milestoneIds = [] }, { collections: { Milestones } }) {
    return Milestones.remove({ _id: { $in: milestoneIds } });
  },

  async unlinkActions(
    { _id: documentId },
    {
      collections: { Actions },
      services: { ActionService },
    },
  ) {
    const query = { 'linkedTo.documentId': documentId };
    const options = { fields: { _id: 1 } };
    const actions = await Actions.find(query, options).fetch();
    const ids = getIds(actions);

    return Promise.all(ids.map(_id => ActionService.unlinkDocument({ _id, documentId })));
  },

  async removeLessons({ _id }, { collections: { LessonsLearned } }) {
    return LessonsLearned.remove({ 'linkedTo.documentId': _id });
  },

  async removeFiles({ fileIds = [] }, { collections: { Files } }) {
    return Files.remove({ _id: { $in: fileIds } });
  },

  async delete({ _id }, { userId }) {
    const goal = await this.collection.findOne({ _id });
    const res = await this.set({
      _id,
      isDeleted: true,
      deletedBy: userId,
      deletedAt: new Date(),
    });

    await this.deleteMilestones(goal, { userId });

    return res;
  },

  async remove({ _id }, { goal, ...context }) {
    const res = await this.collection.remove({ _id });

    await Promise.all([
      this.removeMilestones(goal, context),
      this.removeLessons(goal, context),
      this.unlinkActions(goal, context),
      this.removeFiles(goal, context),
    ]);

    return res;
  },

  async restore({ _id }) {
    const query = { _id };
    const modifier = {
      $set: {
        isDeleted: false,
        isCompleted: false,
      },
      $unset: {
        deletedBy: '',
        deletedAt: '',
        completedBy: '',
        completedAt: '',
        completionComment: '',
      },
    };
    const { milestoneIds = [] } = await this.collection.findOne(query);
    const res = await this.collection.update(query, modifier);

    await Promise.all(milestoneIds.map(milestoneId =>
      MilestoneService.restore({ _id: milestoneId })));

    return res;
  },

  async set({ _id, ...args }) {
    return this.collection.update({ _id }, { $set: args });
  },
};
