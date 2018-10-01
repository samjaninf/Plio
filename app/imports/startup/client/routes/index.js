/* global toastr */

import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Meteor } from 'meteor/meteor';
import { AccountsTemplates } from 'meteor/useraccounts:core';
import ReactDOM from 'react-dom';
import React from 'react';
import { $ } from 'meteor/jquery';
import '/imports/ui/components';
import '/imports/ui/layouts';
import '/imports/ui/pages';

import './triggers';

import {
  renderStandards,
  renderRisks,
  renderCustomers,
  renderHelpDocs,
  renderTransitionalLayout,
  renderCanvasLayout,
  renderNcs,
  renderWorkInbox,
  renderUserDirectory,
  renderDashboard,
} from './actions';
import { DOCUMENT_TYPE_BY_ROUTE_MAP } from './constants';

BlazeLayout.setRoot('#app');

function redirectHandler() {
  const targetURL = FlowRouter.getQueryParam('b');
  if (targetURL) {
    FlowRouter.go(targetURL);
  } else {
    FlowRouter.withReplaceState(() => {
      FlowRouter.go('hello');
    });
  }
}

function checkLoggedIn(context, redirect) {
  // Redirect to maintenance route can be here.
  // redirect('maintenance'); return;
  if (!Meteor.loggingIn()) {
    if (!Meteor.user()) {
      redirect('signIn', {}, { b: context.path });
    }
  }
}

function checkEmailVerified(context, redirect) {
  const user = Meteor.user();
  const isOnUserWaiting = context.route.name === 'userWaiting';

  if (user) {
    const email = user.emails[0];

    if (!email.verified) {
      if (!isOnUserWaiting) {
        redirect('userWaiting');
      }
    } else if (isOnUserWaiting) {
      redirect('hello');
    }
  }
}

AccountsTemplates.configureRoute('signIn', {
  layoutType: 'blaze',
  name: 'signIn',
  path: '/login',
  layoutTemplate: 'LoginLayout',
  layoutRegions: {},
  contentRegion: 'content',
  redirect: redirectHandler,
});

AccountsTemplates.configureRoute('signUp', {
  layoutType: 'blaze',
  name: 'signUp',
  path: '/sign-up',
  layoutTemplate: 'LoginLayout',
  layoutRegions: {},
  contentRegion: 'content',
  redirect: redirectHandler,
});

AccountsTemplates.configureRoute('verifyEmail', {
  layoutType: 'blaze',
  name: 'verifyEmail',
  path: '/verify-email',
  layoutTemplate: 'TransitionalLayout',
  template: 'VerifyEmailPage',
  contentRegion: 'content',
  redirect() {
    FlowRouter.withReplaceState(() => {
      FlowRouter.go('hello');
    });
    toastr.success('Email verified! Thanks!');
  },
});

AccountsTemplates.configureRoute('forgotPwd', {
  layoutType: 'blaze',
  name: 'forgotPwd',
  path: '/forgot-password',
  layoutTemplate: 'LoginLayout',
  redirect: redirectHandler,
  layoutRegions: {},
  contentRegion: 'content',
});

AccountsTemplates.configureRoute('resetPwd', {
  layoutType: 'blaze',
  name: 'resetPwd',
  path: '/reset-password',
  layoutTemplate: 'LoginLayout',
  redirect: redirectHandler,
  layoutRegions: {},
  contentRegion: 'content',
});

FlowRouter.route('/accept-invitation/:invitationId', {
  name: 'acceptInvitationPage',
  action() {
    BlazeLayout.render('LoginLayout', {
      content: 'AcceptInvitationPage',
    });
  },
});

FlowRouter.route('/', {
  name: 'home',
  action() {
    BlazeLayout.render('LoginLayout');
  },
});

FlowRouter.route('/hello', {
  name: 'hello',
  action() {
    BlazeLayout.render('TransitionalLayout', {
      content: 'HelloPage',
    });
  },
});

// Uncomment this code to enable maintenance page
// FlowRouter.route('/maintenance', {
//   name: 'maintenance',
//   action(params) {
//     BlazeLayout.render('TransitionalLayout', {
//       content: 'MaintenancePage'
//     });
//   }
// });

FlowRouter.route('/sign-out', {
  name: 'signOut',
  action() {
    Meteor.logout();
    const targetURL = FlowRouter.getQueryParam('b');
    if (targetURL) {
      FlowRouter.go(targetURL);
    } else {
      FlowRouter.withReplaceState(() => {
        FlowRouter.go('hello');
      });
    }
  },
});

FlowRouter.route('/user-waiting', {
  name: 'userWaiting',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action() {
    BlazeLayout.render('TransitionalLayout', {
      content: 'UserAccountWaitingPage',
    });
  },
});

FlowRouter.route('/transfer-organization/:transferId', {
  name: 'transferOrganization',
  triggersEnter: [checkLoggedIn],
  action() {
    BlazeLayout.render('TransitionalLayout', {
      content: 'TransferOrganizationPage',
    });
  },
});

FlowRouter.route('/customers', {
  name: 'customers',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action: renderCustomers(),
});

FlowRouter.route('/customers/:urlItemId', {
  name: 'customer',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action: renderCustomers(),
});

FlowRouter.route('/help-center', {
  name: 'helpDocs',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action: renderHelpDocs(),
});

FlowRouter.route('/help-center/:helpId', {
  name: 'helpDoc',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action: renderHelpDocs(),
});

FlowRouter.route('/:orgSerialNumber/standards', {
  name: 'standards',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action: renderStandards(),
});

FlowRouter.route('/:orgSerialNumber/standards/:urlItemId', {
  name: 'standard',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action: renderStandards(),
});

FlowRouter.route('/:orgSerialNumber/standards/:urlItemId/discussion', {
  name: 'standardDiscussion',
  triggersEnter: [checkLoggedIn, checkEmailVerified, BlazeLayout.reset],
  action: renderStandards({ isDiscussionOpened: true }),
});

FlowRouter.route('/:orgSerialNumber/risks', {
  name: 'risks',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action: renderRisks(),
});

FlowRouter.route('/:orgSerialNumber/risks/:urlItemId', {
  name: 'risk',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action: renderRisks(),
});

FlowRouter.route('/:orgSerialNumber/risks/:urlItemId/discussion', {
  name: 'riskDiscussion',
  triggersEnter: [checkLoggedIn, checkEmailVerified, BlazeLayout.reset],
  action: renderRisks({ isDiscussionOpened: true }),
});

FlowRouter.route('/:orgSerialNumber', {
  name: 'dashboardPage',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action() {
    BlazeLayout.reset();

    $(() => ReactDOM.unmountComponentAtNode(document.getElementById('app')));

    renderDashboard();
  },
});

FlowRouter.route('/:orgSerialNumber/users', {
  name: 'userDirectoryPage',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action: renderUserDirectory,
});

FlowRouter.route('/:orgSerialNumber/users/:userId', {
  name: 'userDirectoryUserPage',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action: renderUserDirectory,
});

FlowRouter.route('/:orgSerialNumber/non-conformities', {
  name: 'nonconformities',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action: renderNcs({ content: 'NC_Page' }),
});

FlowRouter.route('/:orgSerialNumber/non-conformities/:urlItemId', {
  name: 'nonconformity',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action: renderNcs({ content: 'NC_Page' }),
});

FlowRouter.route('/:orgSerialNumber/non-conformities/:urlItemId/discussion', {
  name: 'nonConformityDiscussion',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action: renderNcs(({ content: 'NC_Page', isDiscussionOpened: true })),
});

FlowRouter.route('/:orgSerialNumber/work-inbox', {
  name: 'workInbox',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action: renderWorkInbox,
});

FlowRouter.route('/:orgSerialNumber/work-inbox/:workItemId', {
  name: 'workInboxItem',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action: renderWorkInbox,
});

FlowRouter.route('/:orgSerialNumber/:route/:documentId/unsubscribe', {
  name: 'unsubscribeFromNotifications',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action: renderTransitionalLayout(async ({ documentId, route, orgSerialNumber }) => {
    const documentType = DOCUMENT_TYPE_BY_ROUTE_MAP[route];
    const { default: UnsubscribeFromNotifications } =
      await import('../../../client/react/pages/components/Unsubscribe/Notifications');

    return {
      content: (
        <UnsubscribeFromNotifications {...{ documentId, documentType, orgSerialNumber }} />
      ),
    };
  }),
});

FlowRouter.route('/:orgSerialNumber/unsubscribe', {
  name: 'unsubscribeFromDailyRecap',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action: renderTransitionalLayout(async ({ orgSerialNumber }) => {
    const { default: UnsubscribeFromDailyRecap } =
      await import('../../../client/react/pages/components/Unsubscribe/DailyRecap');

    return {
      content: (
        <UnsubscribeFromDailyRecap {...{ orgSerialNumber }} />
      ),
    };
  }),
});

FlowRouter.route('/:orgSerialNumber/:route/:documentId/discussion/unsubscribe', {
  name: 'unsubscribeFromDiscussionNotifications',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action: renderTransitionalLayout(async ({ documentId, route, orgSerialNumber }) => {
    const documentType = DOCUMENT_TYPE_BY_ROUTE_MAP[route];
    const { default: UnsubscribeFromDiscussion } =
      await import('../../../client/react/pages/components/Unsubscribe/Discussion');

    return {
      content: (
        <UnsubscribeFromDiscussion
          {...{ documentId, documentType, orgSerialNumber }}
        />
      ),
    };
  }),
});

FlowRouter.route('/:orgSerialNumber/canvas', {
  name: 'canvas',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action: renderCanvasLayout(),
});
