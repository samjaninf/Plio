import { Template } from 'meteor/templating';

import { deleteOrganization } from '../../../../../../../api/organizations/methods';

Template.OrgSettings_OrgDeletion.viewmodel({
  mixin: 'modal',
  organizationId: '',
  deleteOrganization({ organizationId, password }, cb) {
    deleteOrganization.call({ organizationId, ownerPassword: password }, cb);
  },
  afterDelete(err) {
    if (!err) {
      const { onDeleteOrg } = this.parent().parent();
      if (onDeleteOrg) onDeleteOrg();
      this.modal().close();
    }
  },
});
