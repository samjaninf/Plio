import { Meteor } from 'meteor/meteor';

import { updateProgress, terminateUploading } from '../../../api/files/methods';


const UploadsStore = {

  _uploaders: {},

  _progressUpdateIntervals: {},

  getUploader(fileId) {
    return this._uploaders[fileId];
  },

  addUploader(fileId, uploader) {
    this._uploaders[fileId] = uploader;
    this._setUpProgressUpdating(fileId, uploader);
  },

  terminateUploading(fileId, cb) {
    const uploader = this.getUploader(fileId);
    if (uploader) {
      if (uploader.xhr) uploader.xhr.abort();
      this.removeUploader(fileId);
    }

    this._clearProgressUpdateInterval(fileId);

    terminateUploading.call({ _id: fileId }, cb);
  },

  removeUploader(fileId) {
    delete this._uploaders[fileId];
  },

  _setUpProgressUpdating(fileId, uploader) {
    const progressInterval = Meteor.setInterval(() => {
      const progress = uploader.progress();

      if (!progress && progress !== 0 || progress === 1) {
        Meteor.clearInterval(progressInterval);
      } else {
        updateProgress.call({ _id: fileId, progress }, (err) => {
          if (err) {
            Meteor.clearInterval(progressInterval);
            UploadsStore.terminateUploading(fileId);

            throw err;
          }
        });
      }
    }, 1500);

    this._progressUpdateIntervals[fileId] = progressInterval;
  },

  _clearProgressUpdateInterval(fileId) {
    Meteor.clearInterval(this._progressUpdateIntervals[fileId]);
    delete this._progressUpdateIntervals[fileId];
  },

};

export default UploadsStore;
