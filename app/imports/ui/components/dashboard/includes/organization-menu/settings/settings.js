import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { pick } from 'ramda';

import { Departments } from '../../../../../../share/collections/departments';
import { StandardTypes } from '../../../../../../share/collections/standards-types';
import { RiskTypes } from '../../../../../../share/collections/risk-types';
import { StandardsBookSections } from '../../../../../../share/collections/standards-book-sections';
import { isOrgOwner } from '../../../../../../api/checkers';

import HomeScreenSubcard from
  '../../../../../../client/react/organization-settings/components/HomeScreenSubcard';
import ReviewContainer
  from '../../../../../../client/react/organization-settings/containers/ReviewContainer';
import KeyGoalsSettingsContainer from
  '../../../../../../client/react/organization-settings/containers/KeyGoals';
import { DocumentTypes } from '../../../../../../share/constants';
import { OrganizationSettingsHelp } from '../../../../../../api/help-messages';
import {
  setNCGuideline,
  setPGGuideline,
  setRKGuideline,
} from '../../../../../../api/organizations/methods';
import { OrgSettingsDocSubs } from '../../../../../../startup/client/subsmanagers';
import StandardSectionsSubcardContainer from
  '../../../../../../client/react/organization-settings/containers/StandardSectionsSubcardContainer'; // eslint-disable-line max-len
import StandardTypesSubcardContainer from
  '../../../../../../client/react/organization-settings/containers/StandardTypesSubcardContainer';

Template.OrgSettings.viewmodel({
  mixin: 'organization',
  name: '',
  currency: '',
  timezone: '',
  OrganizationSettingsHelp,
  onCreated(template) {
    OrgSettingsDocSubs.subscribe(
      'currentUserOrganizationBySerialNumber',
      this.organizationSerialNumber(),
    );
    template.autorun(() => {
      const organization = this.organization();

      if (organization) {
        this.load(pick(['name', 'currency', 'timezone'], organization));

        OrgSettingsDocSubs.subscribe('organizationDeps', organization._id);
      }
    });
  },
  homeScreenSubcard() {
    return HomeScreenSubcard;
  },
  departments() {
    const query = { organizationId: this.organizationId() };
    return Departments.find(query);
  },
  standardsTypes() {
    const query = { organizationId: this.organizationId() };
    return StandardTypes.find(query).fetch();
  },
  standardsBookSections() {
    const query = { organizationId: this.organizationId() };
    return StandardsBookSections.find(query).fetch();
  },
  riskTypes() {
    const query = { organizationId: this.organizationId() };
    return RiskTypes.find(query);
  },
  ownerId() {
    const organization = this.organization();
    return organization ? organization.ownerId() : '';
  },
  workflowDefaults() {
    const { workflowDefaults } = this.organization() || {};
    return workflowDefaults;
  },
  reminders() {
    const { reminders } = this.organization() || {};
    return reminders;
  },
  NCGuidelines() {
    const { ncGuidelines } = this.organization() || {};
    return ncGuidelines;
  },
  PGGuidelines() {
    const { pgGuidelines } = this.organization() || {};
    return pgGuidelines;
  },
  RKGuidelines() {
    const { rkGuidelines } = this.organization() || {};
    return rkGuidelines;
  },
  rkScoringGuidelines() {
    const { rkScoringGuidelines } = this.organization() || {};
    return rkScoringGuidelines;
  },
  setNCGuidelineMethod() {
    return setNCGuideline;
  },
  setPGGuidelineMethod() {
    return setPGGuideline;
  },
  setRKGuidelineMethod() {
    return setRKGuideline;
  },
  showDangerZone() {
    return isOrgOwner(Meteor.userId(), this.organizationId());
  },
  reviewContainer() {
    return ReviewContainer;
  },
  keyGoalsSettings() {
    return KeyGoalsSettingsContainer;
  },
  DocumentTypes: () => DocumentTypes,
  StandardSectionsSubcardContainer: () => StandardSectionsSubcardContainer,
  StandardTypesSubcardContainer: () => StandardTypesSubcardContainer,
});
