import { Template } from 'meteor/templating';
import pluralize from 'pluralize';
import moment from 'moment-timezone';
import { pluck, reject, isNil, uniq, compose } from 'ramda';
import { swal } from 'meteor/plio:bootstrap-sweetalert';

import { inviteMultipleUsersByEmail } from '../../../../../api/organizations/methods';
import { ALERT_AUTOHIDE_TIME } from '../../../../../api/constants';
import UsersInviteForm from '../../../../../client/react/forms/components/UsersInviteForm';

const getEmails = compose(uniq, reject(isNil), pluck('value'));

Template.UserDirectory_InviteUsers.viewmodel({
  mixin: ['modal', 'organization'],
  UsersInviteForm: () => UsersInviteForm,
  save() {
    const event = new Event('submit', { cancelable: true });
    this.templateInstance.$('form')[0].dispatchEvent(event);
  },
  onSubmit({
    options,
    welcome: welcomeMessage,
  }) {
    const organizationId = this.organizationId();
    const emails = getEmails(options);
    const args = { organizationId, emails, welcomeMessage };

    if (emails.length === 0) {
      return this.modal().setError('You need to fill in at least one valid email address first');
    }

    return this.modal().callMethod(inviteMultipleUsersByEmail, args, (err, res) => {
      if (!err) {
        const { organizationName = 'organization' } = this.data();
        const { invitedEmails = [], addedEmails = [] } = res;
        const invitedEmailsText = invitedEmails.length
          // eslint-disable-next-line max-len
          ? `${pluralize('Invite', invitedEmails.length)} to ${invitedEmails.join(', ')} ${invitedEmails.length ? 'were' : 'was'} sent successfully.\n`
          : '';
        const addedEmailsText = addedEmails.length
          // eslint-disable-next-line max-len
          ? `${addedEmails.join(', ')} ${addedEmails.length ? 'are already Plio users. These users have' : 'is already a Plio user. This user has'} now been added to the ${organizationName} organization in Plio.\n`
          : '';
        const successMessagePart = `${invitedEmailsText}${addedEmailsText}`;
        const failMessagePart = res.error ? `\n${res.error}` : '';

        let notificationTitle;
        if (failMessagePart) {
          if (successMessagePart) {
            notificationTitle = 'Some users were not invited!';
          } else {
            notificationTitle = 'Not invited!';
          }
        } else {
          notificationTitle = 'Invited!';
        }

        const expirationMessagePart = invitedEmailsText.length
          // eslint-disable-next-line max-len
          ? `\nInvitation expiration date: ${moment().add(res.expirationTime, 'days').format('MMMM Do YYYY')}`
          : '';

        swal({
          title: notificationTitle,
          text: `${successMessagePart}${failMessagePart}${expirationMessagePart}`,
          type: failMessagePart ? 'error' : 'success',
          timer: ALERT_AUTOHIDE_TIME * 2,
          showConfirmButton: false,
        });

        this.modal().close();
      }
    });
  },
});
