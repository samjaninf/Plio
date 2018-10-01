/* global $ */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { isMobileRes } from '../../../../../api/checkers';
import { flattenObjects } from '../../../../../api/helpers';
import { MyPreferencesHelp } from '../../../../../api/help-messages';
import { userLogout } from '../../../../../client/store/actions/globalActions';
import { UserPresenceStatuses, SUPPORT_FORUM_URL } from '../../../../../api/constants';
import { client } from '../../../../../client/apollo';

const STATUSES = [
  {
    text: 'Online',
    css: 'text-success',
    status: UserPresenceStatuses.ONLINE,
  },
  {
    text: 'Away',
    css: 'text-warning',
    status: UserPresenceStatuses.AWAY,
  },
  {
    text: 'Offline',
    css: 'text-danger',
    status: UserPresenceStatuses.OFFLINE,
  },
];

Template.UserMenu.viewmodel({
  share: 'window',
  mixin: ['user', 'modal', 'organization', 'roles', 'mobile', 'store'],
  linkArgs() {
    const className = 'dropdown-item';
    const orgSerialNumber = this.organizationSerialNumber();
    const userId = Meteor.userId();
    const getPath = (path, params) => FlowRouter.path(path, { ...params, orgSerialNumber });

    const myProfile = () => {
      const href = getPath('userDirectoryUserPage', { userId });

      return {
        href,
        onClick: () => this.goToMyProfile(href),
      };
    };

    const links = {
      myProfile: myProfile(),
      myPreferences: {
        onClick: this.openUserPreferences.bind(this),
      },
      userDirectory: {
        href: getPath('userDirectoryPage'),
      },
      inviteUsers: {
        onClick: this.onInviteClick.bind(this),
      },
      logout: {
        onClick: this.logout.bind(this),
      },
      helpCenter: {
        href: getPath('helpDocs'),
      },
      supportForum: {
        href: SUPPORT_FORUM_URL,
        target: '_blank',
      },
    };

    const status = (index) => {
      const active = this.isActiveStatus(index) ? 'active' : '';
      return {
        className: `${className} pointer ${active}`,
        onClick: this.changeStatus.bind(this),
      };
    };

    const wrapWithClassName = keys => key =>
      ({ [key]: Object.assign({}, keys[key], { className }) });

    const mappedLinks = flattenObjects(Object.keys(links).map(wrapWithClassName(links)));

    return {
      ...mappedLinks,
      status,
    };
  },
  getStatuses() {
    return STATUSES;
  },
  isActiveStatus(index) {
    const user = Meteor.user();
    const currentStatus = STATUSES[index].text.toLowerCase() ||
                          user.statusDefault;

    return currentStatus === user.statusDefault;
  },
  getActiveClass() {
    const user = Meteor.user();
    const userStatus = user.status;
    const activeStatus = STATUSES.find(status => status.text.toLowerCase() === userStatus);

    return (activeStatus && activeStatus.css) || STATUSES[0].css;
  },
  orgSerialNumber() {
    return FlowRouter.getParam('orgSerialNumber');
  },
  changeStatus(e) {
    e.preventDefault();

    const status = $(e.target).text().trim().toLowerCase();
    if (status !== Meteor.user().statusDefault) {
      Meteor.call('UserPresence:setDefaultStatus', status);
    }
  },
  async onInviteClick(event) {
    event.preventDefault();

    await import('../../../userdirectory/includes/invite');

    const { organizationId, organizationName } = this.data();

    this.modal().open({
      template: 'UserDirectory_InviteUsers',
      _title: 'Invite users',
      submitCaption: 'Invite',
      submitCaptionOnSave: 'Inviting...',
      closeCaption: 'Cancel',
      variation: 'save',
      organizationId,
      organizationName,
    });
  },
  goToMyProfile(href) {
    const mobileWidth = isMobileRes();

    if (mobileWidth) {
      this.width(mobileWidth);
    }

    FlowRouter.go(href);
  },
  logout(e) {
    e.preventDefault();

    Meteor.logout(() => {
      client.resetStore(); // reset apollo store on logout
      this.dispatch(userLogout);
      FlowRouter.go('signIn');
    });
  },
  async openUserPreferences(e) {
    e.preventDefault();

    await import('../../../userdirectory/includes/preferences');

    this.modal().open({
      template: 'UserPreferences',
      _title: 'My preferences',
      helpText: MyPreferencesHelp.myPreferences,
      userId: Meteor.userId(),
    });
  },
});
