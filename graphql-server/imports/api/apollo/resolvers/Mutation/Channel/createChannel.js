import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkOrgMembership,
  insertAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.ChannelService.insert(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkOrgMembership(),
  insertAfterware((root, args, { collections: { Channels } }) => ({
    collection: Channels,
    key: 'channel',
  })),
)(resolver);
