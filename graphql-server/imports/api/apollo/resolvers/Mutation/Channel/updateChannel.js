import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkChannelAccess,
  checkFilesAccess,
  channelUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.ChannelService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkChannelAccess(),
  checkFilesAccess(),
  channelUpdateAfterware(),
)(resolver);
