import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { AccountsTemplates } from 'meteor/useraccounts:core';

// Simply 'inherites' helpers from AccountsTemplates
Template.atForm.helpers(AccountsTemplates.atFormHelpers);

Template.atForm.helpers({
  showForgotPasswordLink() {
    return !!AccountsTemplates.options.showForgotPasswordLink &&
      FlowRouter.getRouteName() === 'signIn';
  },
});

Template.atForm.events({
  'focusout input#at-field-email': function (event, templateInstance) {
    const email = event.target.value;

    if (!email.length) return;

    const regex = /[a-z0-9._%+-]+@([a-z0-9.-]+)\.[a-z]{2,}/i;
    const match = email.match(regex);
    const orgName = match ? match[1] : null;

    if (orgName) { templateInstance.$('input#at-field-companyName').val(orgName); }
  },
});

Template.atForm.onCreated(function () {
  this.autorun(() => {
    if (Meteor.user()) {
      FlowRouter.withReplaceState(() => {
        FlowRouter.go('hello');
      });
    }
  });
});
