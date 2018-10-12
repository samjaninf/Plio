import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Files } from '../../../share/collections';
import Errors from '../../../share/errors';
import { isOrgMember } from '../../../share/checkers';
import { publishCompositeWithMiddleware } from '../../helpers/server';
import { checkLoggedIn } from '../../../share/middleware';
import { getCollectionByDocType } from '../../../share/helpers';

Meteor.publish('fileById', function (fileId) {
  check(fileId, String);

  const { userId } = this;

  const cursor = Files.find({ _id: fileId });

  const { organizationId } = Object.assign({}, cursor.fetch()[0]);

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return cursor;
});

publishCompositeWithMiddleware(
  async ({ _id, documentType }, { userId }) => ({
    find() {
      const collection = getCollectionByDocType(documentType);
      return collection.find({ _id }, { fields: { organizationId: 1, fileIds: 1 } });
    },
    children: [{
      find({ organizationId, fileIds = [] }) {
        if (!isOrgMember(organizationId, userId)) {
          throw new Meteor.Error(403, Errors.NOT_ORG_MEMBER);
        }

        return Files.find({ _id: { $in: fileIds } });
      },
    }],
  }),
  {
    name: 'filesByDocument',
    middleware: [
      async (next, root, args, context) => {
        const { _id, documentType } = args;

        check(_id, String);
        check(documentType, String);

        return next(root, args, context);
      },
      checkLoggedIn(),
    ],
  },
);

publishCompositeWithMiddleware(
  async ({ _id, documentType }, { userId }) => ({
    find() {
      const collection = getCollectionByDocType(documentType);
      return collection.find({ _id }, {
        fields: {
          organizationId: 1,
          source1: 1,
          source2: 1,
        },
      });
    },
    children: [{
      find({ organizationId, source1, source2 }) {
        const { fileId: fileId1 } = source1 || {};
        const { fileId: fileId2 } = source2 || {};
        if (!isOrgMember(organizationId, userId)) {
          throw new Meteor.Error(403, Errors.NOT_ORG_MEMBER);
        }

        return Files.find({ _id: { $in: [fileId1, fileId2] } });
      },
    }],
  }),
  {
    name: 'sourceFilesByDocument',
    middleware: [
      async (next, root, args, context) => {
        const { _id, documentType } = args;

        check(_id, String);
        check(documentType, String);

        return next(root, args, context);
      },
      checkLoggedIn(),
    ],
  },
);
