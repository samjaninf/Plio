import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import moment from 'moment-timezone';

import { swal } from '../../client/util';
import { Organizations } from '../../share/collections/organizations';
import { remove } from '../../api/users/methods';
import { OrgCurrencies } from '../../share/constants';
import { getSelectedOrgSerialNumber, setSelectedOrgSerialNumber } from '../../api/helpers';
import { createOrgQueryWhereUserIsMember } from '../../share/mongo/queries';
import { ALERT_AUTOHIDE_TIME } from '../../api/constants';


Template.HelloPage.viewmodel({
  mixin: ['router', 'modal'],
  onCreated(template) {
    template.autorun(() => {
      const currentUser = Meteor.user();
      const organizationsHandle = template.subscribe('currentUserOrganizations');
      if (!Meteor.loggingIn() && organizationsHandle.ready()) {
        if (currentUser) {
          const query = createOrgQueryWhereUserIsMember(currentUser._id);
          const selectedOrganizationSerialNumber = getSelectedOrgSerialNumber();
          const serialNumber = parseInt(selectedOrganizationSerialNumber, 10);
          const organization = Organizations.findOne({ ...query, serialNumber });

          if (serialNumber && organization) {
            this.goToHomePageOfOrg(organization);
          } else {
            const org = Organizations.findOne(query);
            if (org) {
              setSelectedOrgSerialNumber(org.serialNumber);
              this.goToHomePageOfOrg(org);
            }
          }
        } else {
          FlowRouter.withReplaceState(() => {
            FlowRouter.go('signIn');
          });
        }
      }
    });
  },
  openCreateNewOrgModal(e) {
    e.preventDefault();

    this.modal().open({
      template: 'Organizations_Create',
      _title: 'New organization',
      variation: 'save',
      timezone: moment.tz.guess(),
      ownerName: Meteor.user().fullName(),
      currency: OrgCurrencies.GBP,
    });
  },
  deleteAccount(e) {
    e.preventDefault();

    swal({
      title: 'Are you sure?',
      text: 'Your account will be deleted permanently!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      closeOnConfirm: false,
    }, () => {
      remove.call({}, (err) => {
        if (err) {
          swal({
            title: 'Oops... Something went wrong!',
            text: err.reason,
            type: 'error',
            timer: ALERT_AUTOHIDE_TIME,
            showConfirmButton: false,
          });
        } else {
          swal({
            title: 'Removed!',
            text: 'Your account was removed successfully!',
            type: 'success',
            timer: ALERT_AUTOHIDE_TIME,
            showConfirmButton: false,
          });
        }
      });
    });
  },
});
