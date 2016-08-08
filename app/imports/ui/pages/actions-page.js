import { Template } from 'meteor/templating';

import { Occurrences } from '/imports/api/occurrences/occurrences.js';

Template.ActionsPage.viewmodel({
  share: 'window',
  mixin: ['mobile', 'organization', 'nonconformity'],
  autorun() {
    const template = this.templateInstance;
    const _id = this.organizationId();

    const NCIds = this._getNCsByQuery({}).map(({ _id }) => _id);

    template.subscribe('lessons', _id);
    template.subscribe('departments', _id);
    template.subscribe('riskTypes', _id);
    template.subscribe('standards', _id);
    template.subscribe('occurrencesByNCIds', NCIds);
  }
});