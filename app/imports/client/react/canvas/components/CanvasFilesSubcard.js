import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { complement, eqProps, pluck, append, reject, equals } from 'ramda';

import { UploaderMetaIdNames } from '../../../../share/constants';
import { composeWithTracker, swal } from '../../../util';
import { Files } from '../../../../share/collections';
import { FilesSubcard } from '../../components';

const enhance = composeWithTracker(
  ({
    documentId,
    documentType,
    organizationId,
  }, onData) => {
    const subscription = Meteor.subscribe(
      'filesByDocument',
      { _id: documentId, documentType },
      { onStop: error => error && swal.error(error, 'Files subscription error') },
    );

    if (subscription.ready()) {
      const files = Files.find({ organizationId }).fetch();

      onData(null, {
        fileIds: pluck('_id', files),
        uploaderMetaContext: {
          organizationId,
          [UploaderMetaIdNames[documentType]]: documentId,
        },
      });
    }
  },
  {
    propsToWatch: ['documentId', 'organizationId'],
    shouldSubscribe: complement(eqProps)('documentId'),
  },
);

const CanvasFilesSubcard = ({
  documentId,
  fileIds,
  onUpdate,
  ...props
}) => (
  <FilesSubcard
    {...{ fileIds, ...props }}
    onAfterInsert={fileId => onUpdate({
      variables: {
        input: {
          _id: documentId,
          fileIds: append(fileId, fileIds),
        },
      },
    })}
    onAfterRemove={({ _id: fileId }) => onUpdate({
      variables: {
        input: {
          _id: documentId,
          fileIds: reject(equals(fileId), fileIds),
        },
      },
    })}
  />
);

CanvasFilesSubcard.propTypes = {
  documentId: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  fileIds: PropTypes.arrayOf(PropTypes.string),
};

export default enhance(CanvasFilesSubcard);
