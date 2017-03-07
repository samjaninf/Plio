import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';

import { updateViewedBy } from '/imports/api/reviews/methods';
import { isViewed } from '/imports/api/checkers';

Template.Subcards_Review.viewmodel({
  onRendered(templateInstance) {
    const doc = templateInstance.data.doc;
    const userId = Meteor.userId();

    if (doc && !isViewed(doc, userId)) {
      Meteor.defer(() => updateViewedBy.call({ _id: doc._id }));
    }
  },
  label: 'Review',
  reviewedAt: '',
  reviewedBy: '',
  comments: '',
  scheduledDate: '',
  update({ ...args }, cb) {
    if (_.keys(args).every(key => this.data()[key] === args[key])) return;

    _.keys(args).forEach(key => this[key](args[key]));

    this.parent().update(args, cb);
  },
  getData() {
    const { reviewedAt, reviewedBy, comments } = this.data();
    return { reviewedAt, reviewedBy, comments };
  },
});