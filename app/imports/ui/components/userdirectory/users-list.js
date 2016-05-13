import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';

import { UserRoles } from '/imports/api/constants.js';

Template.UsersList.viewmodel({
  share: 'search',
  mixin: ['user', 'organization', 'modal'],
  organizationId() {
    return this.organization() && this.organization()._id;
  },
  canInviteUsers() {
    return Roles.userIsInRole(
      Meteor.userId(),
      UserRoles.INVITE_USERS,
      this.organizationId()
    );
  },
  isActiveUser(userId) {
    return this.parent().activeUser() === userId;
  },

  getUserPath(userId) {
    return FlowRouter.path('userDirectoryUserPage', {
      orgSerialNumber: this.parent().getCurrentOrganizationSerialNumber(),
      userId: userId
    });
  },

  onInviteClick(event) {
    event.preventDefault();
    const orgSerialNumber = this.parent().getCurrentOrganizationSerialNumber();
    const organizationId = Organizations.findOne({serialNumber: orgSerialNumber})._id;

    this.modal().open({
      template: 'UserDirectory_InviteUsers',
      title: 'Invite users',
      submitCaption: 'Invite',
      variation: 'save',
      organizationId
    });
  }
});
