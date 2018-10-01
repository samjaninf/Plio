/* global toastr */

import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';

import {
  insert as insertFile,
  updateProgress,
  updateUrl,
} from '../../../api/files/methods';
import UploadsStore from './uploads-store.js';


const defaultMaxFileSize = Meteor.settings.public.otherFilesMaxSize;

export default class UploadService {
  constructor({
    slingshotDirective,
    slingshotContext = {},
    maxFileSize = defaultMaxFileSize,
    fileData = {},
    hooks = {},
  }) {
    this.slingshotDirective = slingshotDirective;
    this.slingshotContext = slingshotContext;
    this.maxFileSize = maxFileSize;
    this.fileData = fileData;
    this.hooks = hooks;

    this._fileSubscriptions = {};
  }

  upload(file) {
    if (!file) {
      return;
    }

    if (file.size > this.maxFileSize) {
      toastr.error(`${file.name} size exceeds the allowed maximum` +
        `of ${this.maxFileSize / 1024 / 1024} MB`);
      return;
    }

    this._beforeInsert(file);
  }

  uploadExisting(fileId, file) {
    this._subscribe(fileId, {
      onReady: () => this._upload(file, fileId),
    });
  }

  _beforeInsert(file) {
    const beforeInsertHook = this.hooks.beforeInsert;
    if (beforeInsertHook) beforeInsertHook();

    this._insert(file);
  }

  _insert(file) {
    const { name } = file;

    insertFile.call({
      name,
      extension: name.split('.').pop().toLowerCase(),
      organizationId: this.fileData.organizationId,
    }, this._afterInsert.bind(this, file));
  }

  _afterInsert(file, err, fileId) {
    if (err) {
      toastr.error(err.reason || err);
      return;
    }

    this._subscribe(fileId, {
      onReady: () => {
        const afterInsertHook = this.hooks.afterInsert;
        if (afterInsertHook) afterInsertHook(fileId);

        this._upload(file, fileId);
      },
    });
  }

  _upload(file, fileId) {
    const uploader = new Slingshot.Upload(this.slingshotDirective, this.slingshotContext);

    UploadsStore.addUploader(fileId, uploader);

    uploader.send(file, this._afterUpload.bind(this, fileId));
  }

  _afterUpload(fileId, err, url) {
    if (err) {
      toastr.error(err.reason || err);

      UploadsStore.terminateUploading(fileId, () => {
        this._stopSubscription(fileId);
      });
      return;
    }

    if (url) {
      // eslint-disable-next-line no-param-reassign
      url = encodeURI(url);
    }

    const afterUploadHook = this.hooks.afterUpload;
    if (afterUploadHook) afterUploadHook(fileId, url);

    updateUrl.call({ _id: fileId, url });

    updateProgress.call({ _id: fileId, progress: 1 }, () => {
      UploadsStore.removeUploader(fileId);

      // if file document is needed after UploadService finished its job,
      // it must be delivered to the client by another publication
      this._stopSubscription(fileId);
    });
  }

  _subscribe(fileId, options) {
    // we need to make sure that file document is available on the client,
    // because we may read some properties of that document and call methods
    // during upload process
    const handle = Meteor.subscribe('fileById', fileId, options);
    this._fileSubscriptions[fileId] = handle;
  }

  _stopSubscription(fileId) {
    const fileSub = this._fileSubscriptions[fileId];
    if (fileSub) fileSub.stop();
    delete this._fileSubscriptions[fileId];
  }
}
