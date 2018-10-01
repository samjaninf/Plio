import { Template } from 'meteor/templating';

import { insert } from '../../../../../../api/organizations/methods.js';

Template.Organizations_Create.viewmodel({
  mixin: ['modal', 'router'],
  name: '',
  save() {
    const { name, timezone, currency } = this.getData();

    this.modal().callMethod(insert, { name, timezone, currency }, this.onAfterInsert.bind(this));
  },
  onAfterInsert(err, organizationId) {
    if (!err) {
      const { onCreateOrg } = this;
      if (onCreateOrg) onCreateOrg(organizationId);
      this.modal().close();
    }
  },
  getData() {
    return this.child('OrgSettings_MainSettings').getData();
  },
});
