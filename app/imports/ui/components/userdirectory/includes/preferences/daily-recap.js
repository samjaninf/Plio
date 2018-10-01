import { Blaze } from 'meteor/blaze';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';

import { Organizations } from '/imports/share/collections/organizations';
import { updateUserSettings } from '/imports/api/organizations/methods';
import { createOrgQueryWhereUserIsMember } from '../../../../../share/mongo/queries';

Template.UserPreferences_DailyRecap.viewmodel({
  mixin: ['modal', 'collapse'],
  userId: '',
  onCreated(template) {
    template.subscribe('currentUserOrganizations');
  },
  orgsCount() {
    return _(this.orgsData()).filter(doc => doc.sendDailyRecap).length;
  },
  orgsData() {
    const query = createOrgQueryWhereUserIsMember(this.userId());
    const options = {
      fields: { _id: 1, name: 1, users: 1 },
      sort: { name: 1 },
    };
    const userOrganizations = Organizations.find(query, options);

    return userOrganizations.map((org) => {
      const orgUserDoc = _(org.users).find(userDoc => userDoc.userId === this.userId());

      return {
        orgId: org._id,
        orgName: org.name,
        sendDailyRecap: orgUserDoc.sendDailyRecap,
      };
    });
  },
  updateDailyRecapSetting(e) {
    const { orgId, sendDailyRecap } = Blaze.getData(e.target);

    this.modal().callMethod(updateUserSettings, {
      organizationId: orgId,
      sendDailyRecap: !sendDailyRecap,
    });
  },
});
