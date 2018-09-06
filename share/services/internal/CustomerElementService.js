import { generateSerialNumber } from '../../../share/helpers';

export default {
  async insert(args, context) {
    const {
      organizationId,
      title,
      description,
      importance,
      linkedTo,
    } = args;
    const { userId } = context;
    const collection = await this.collection(context);
    const serialNumber = generateSerialNumber(collection, { organizationId });

    return collection.insert({
      organizationId,
      createdBy: userId,
      serialNumber,
      title,
      description,
      importance,
      linkedTo,
    });
  },

  async update(args, context) {
    const {
      _id,
      title,
      description,
      importance,
    } = args;
    const { userId } = context;
    const collection = await this.collection(context);
    const query = { _id };
    const modifier = {
      $set: {
        title,
        description,
        importance,
        updatedBy: userId,
      },
    };

    return collection.update(query, modifier);
  },
};