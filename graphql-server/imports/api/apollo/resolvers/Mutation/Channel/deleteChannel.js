import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkChannelAccess,
  deleteAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.ChannelService.delete(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkChannelAccess(),
  deleteAfterware(async (root, args, context) => ({
    collection: context.collections.Channels,
  })),
)(resolver);
