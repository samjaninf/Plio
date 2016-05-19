import { Template } from 'meteor/templating';

import { StandardTypes } from '/imports/api/standards-types/standards-types.js';
import { updateViewedBy } from '/imports/api/standards/methods.js';

Template.ListSubItem.viewmodel({
  share: 'standard',
  mixin: ['organization', 'standard'],
  autorun() {
    if (this._id() === this.selectedStandardId() && this.isNew()) {
      this.updateViewedBy();
    }
  },
  standardType() {
    const typeId = this.typeId && this.typeId();
    return StandardTypes.findOne({ _id: typeId });
  },
  typeName() {
    return this.standardType() && this.standardType().name;
  },
  isNew() {
    return this.viewedBy && !_.contains(this.viewedBy(), Meteor.userId());
  },
  select() {
    if ($(window).width() < 768) {
      $('.content-list').attr('style', 'display: none !important');
      $('.content-cards').attr('style', 'display: block !important');
    }

    const { serialNumber } = this.organization();

    this.selectedStandardId(this._id());
    FlowRouter.go(
      'standard',
      { orgSerialNumber: serialNumber, standardId: this._id() },
      { by: this.activeStandardFilter() }
    );
  },
  updateViewedBy() {
    const _id = this._id();
    
    updateViewedBy.call({ _id });
  }
});
