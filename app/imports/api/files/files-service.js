import { Files } from '../../share/collections/files.js';

export default {
  collection: Files,

  insert({ ...args }) {
    return this.collection.insert({ ...args });
  },

  update({ _id, ...args }) {
    const query = { _id };
    const options = {
      $set: {
        ...args,
      },
    };

    return this.collection.update(query, options);
  },

  bulkRemove({ fileIds }) {
    return this.collection.remove({ _id: { $in: fileIds } });
  },

  remove({ _id }) {
    return this.collection.remove({ _id });
  },
};
