import { Template } from 'meteor/templating';

import { OrgSubs } from '/imports/startup/client/subsmanagers';
import MainHeaderWithApollo from
  '../../../client/react/main-header/components/MainHeaderWithApollo';

Template.Dashboard_Layout.viewmodel({
  mixin: 'organization',
  isReady: false,
  _subHandlers: [],
  autorun: [
    function () {
      const subHandlers = this._subHandlers();
      const isReady = subHandlers.length && subHandlers.every(handle => handle.ready());
      this.isReady(isReady);
    },
    function () {
      if (typeof this.organizationSerialNumber() !== 'number') return;

      this._subHandlers([
        OrgSubs.subscribe('currentUserOrganizationBySerialNumber', this.organizationSerialNumber()),
      ]);
    },
  ],
  MainHeaderWithApollo: () => MainHeaderWithApollo,
});
