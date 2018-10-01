import { getWorkspaceDefaultsUpdater } from '../helpers';

export default {
  async updateWorkspaceDefaults(
    { _id, ...workspaceDefaults },
    { userId, collections: { Organizations } },
  ) {
    const query = { _id };
    const modifier = {
      $set: {
        ...getWorkspaceDefaultsUpdater(workspaceDefaults),
        updatedBy: userId,
      },
    };
    return Organizations.update(query, modifier);
  },

  async update({
    _id,
    homeScreenType,
    lastAccessedDate,
  }, { userId, collections: { Organizations } }) {
    const query = { _id };
    const modifier = {
      $set: {
        homeScreenType,
        lastAccessedDate,
        updatedBy: userId,
      },
    };

    return Organizations.update(query, modifier);
  },
};
