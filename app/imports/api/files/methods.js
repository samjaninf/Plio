import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import FilesService from './files-service';
import { Files } from '../../share/collections/files';
import { RequiredSchema } from '../../share/schemas/files-schema';
import {
  IdSchema, UrlSchema,
  ProgressSchema, ErrorSchema,
} from '../../share/schemas/schemas';
import { checkOrgMembership, checkDocExistance } from '../../api/checkers';

const onUpdateCheck = ({ _id, userId }) => {
  if (!userId) {
    throw new Meteor.Error(403, 'Unauthorized user cannot update files');
  }

  const { organizationId } = checkDocExistance(Files, { _id });

  if (Meteor.isServer) {
    checkOrgMembership(userId, organizationId);
  }
  return true;
};

export const insert = new ValidatedMethod({
  name: 'Files.insert',

  validate: RequiredSchema.validator(),

  run(args) {
    const { userId } = this;

    if (!userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot create files');
    }

    if (Meteor.isServer) {
      checkOrgMembership(userId, args.organizationId);
    }
    return FilesService.insert(args);
  },
});

export const updateProgress = new ValidatedMethod({
  name: 'Files.updateProgress',

  validate: new SimpleSchema([IdSchema, ProgressSchema]).validator(),

  run({ _id, progress }) {
    const { userId } = this;

    onUpdateCheck({ _id, userId });
    return FilesService.update({ _id, progress });
  },
});

export const updateUrl = new ValidatedMethod({
  name: 'Files.updateUrl',

  validate: new SimpleSchema([IdSchema, UrlSchema]).validator(),

  run({ _id, url }) {
    const { userId } = this;

    onUpdateCheck({ _id, userId });
    return FilesService.update({ _id, url, status: 'completed' });
  },
});

export const terminateUploading = new ValidatedMethod({
  name: 'Files.terminateUploading',

  validate: new SimpleSchema([IdSchema, ErrorSchema]).validator(),

  run({ _id }) {
    const { userId } = this;

    onUpdateCheck({ _id, userId });
    return FilesService.update({ _id, status: 'failed' });
  },
});

export const remove = new ValidatedMethod({
  name: 'Files.remove',

  validate: IdSchema.validator(),

  run({ _id }) {
    const { userId } = this;

    onUpdateCheck({ _id, userId });

    return FilesService.remove({ _id });
  },
});
