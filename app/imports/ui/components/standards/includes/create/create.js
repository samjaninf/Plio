import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';
import { and } from 'ramda';

import { getNestingLevel } from '../../../../../share/helpers';
import { uploadFile } from '../../../../../client/react/standards/helpers';
import { insert } from '../../../../../api/standards/methods';
import { setModalError, inspire } from '../../../../../api/helpers';
import { insert as insertFile } from '../../../../../api/files/methods';

Template.CreateStandard.viewmodel({
  mixin: ['standard', 'organization', 'router', 'getChildrenData', 'modal'],
  validate({
    sourceType,
    sourceFile,
    sourceUrl,
    sourceVideoUrl,
    ...data
  }) {
    let valid = and(
      sourceType,
      sourceFile || sourceUrl || sourceVideoUrl,
    );

    if (!valid) {
      setModalError('The new standard cannot be created without a source file. ' +
        'Please add a source file to your standard.');

      return false;
    }

    Object.keys(data).forEach((key) => {
      if (!data[key]) {
        let message;
        /* eslint-disable max-len */
        switch (key) {
          case 'sectionId':
            message = 'The new standard cannot be created without a section. You can create a new section by typing it\'s name into the corresponding text input';
            break;
          case 'typeId':
            message = 'The new standard cannot be created without a type. You can create a new standard type in org settings';
            break;
          default:
            message = `The new standard cannot be created without a ${key}. Please enter a ${key} for your standard.`;
        }
        /* eslint-enable max-len */
        setModalError(message);

        valid = false;
      }
    });

    return valid;
  },
  save() {
    const data = this.getChildrenData();

    if (!this.validate(data)) return;

    this.insert(data);
  },
  insert(args) {
    const { title, sourceType, sourceFile } = args;
    const nestingLevel = getNestingLevel(title);

    if (nestingLevel > 4) {
      setModalError('Maximum nesting is 4 levels. Please change your title.');
      return;
    }

    Object.assign(args, { nestingLevel });

    if ((sourceType === 'attachment') && sourceFile) {
      this.modal().callMethod(insertFile, {
        name: sourceFile.name,
        extension: sourceFile.name.split('.').pop().toLowerCase(),
        organizationId: this.organizationId(),
      }, (err, fileId) => {
        if (!err && fileId) {
          this._insertStandard({ ...args, fileId });
        }
      });
    } else {
      this._insertStandard(args);
    }
  },
  _insertStandard(args) {
    const {
      title, sectionId, typeId,
      owner, status, nestingLevel,
      sourceType, sourceFile, sourceUrl,
      sourceVideoUrl, fileId,
    } = args;

    const source1 = { type: sourceType };
    if (sourceType === 'attachment') {
      Object.assign(source1, { fileId });
    } else {
      const url = {
        url: sourceUrl,
        video: sourceVideoUrl,
      }[sourceType];
      Object.assign(source1, { url });
    }

    const standardArgs = {
      title,
      sectionId,
      typeId,
      owner,
      status,
      nestingLevel,
      source1,
      ...inspire(['organizationId'], this),
    };

    const cb = (_id, open) => {
      if (sourceFile && fileId) {
        uploadFile({
          fileId,
          standardId: _id,
          file: sourceFile,
          organizationId: this.organizationId(),
        });
      }

      if (this.isActiveStandardFilter(3)) {
        this.goToStandard(_id, false);
      } else {
        this.goToStandard(_id);
      }

      open({
        _id,
        _title: 'Standard',
        template: 'EditStandard',
      });
    };

    invoke(this.card, 'insert', insert, standardArgs, cb);
  },
});
