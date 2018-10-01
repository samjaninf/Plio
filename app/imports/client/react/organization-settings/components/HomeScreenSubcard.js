import PropTypes from 'prop-types';
import React from 'react';
import { CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';

import store from '../../../store';
import initMainData from '../containers/loaders/initMainData';
import { HOME_SCREEN_TITLES, WORKSPACE_DEFAULTS } from '../../../../share/constants';
import { pickDeep } from '../../../../api/helpers';
import { OrganizationSettingsHelp } from '../../../../api/help-messages';
import { WithToggle, withApollo } from '../../helpers';
import { composeWithTracker } from '../../../util';
import {
  CardBlock,
  Subcard,
  SubcardHeader,
  SubcardBody,
  GuidancePanel,
  GuidanceIcon,
  HelpInfo,
} from '../../components';
import HomeScreenForm from './HomeScreenForm';
import ImplementationViewDefaultsForm from './ImplementationViewDefaultsForm';
import ImplementationViewTitlesForm from './ImplementationViewTitlesForm';

const enhance = compose(
  withApollo,
  withProps({ store }),
  connect(),
  composeWithTracker(initMainData),
  connect(pickDeep(['organizations.organization'])),
);

const HomeScreenSubcard = enhance(({ loading, organization = {} }) => (
  <WithToggle>
    {({ isOpen, toggle }) => (
      <Subcard {...{ isOpen, toggle, loading }}>
        <SubcardHeader><CardTitle>Home screen</CardTitle></SubcardHeader>
        <SubcardBody>
          <CardBlock>
            <HomeScreenForm {...{ organization }} />

            <legend>Implementation view defaults</legend>
            <ImplementationViewDefaultsForm
              organizationId={organization._id}
              workspaceDefaults={organization[WORKSPACE_DEFAULTS]}
            />

            <legend>Implementation view titles</legend>
            <ImplementationViewTitlesForm
              organizationId={organization._id}
              homeScreenTitles={organization[HOME_SCREEN_TITLES]}
            />
          </CardBlock>

          <WithToggle>
            {guidancePanelState => (
              <HelpInfo>
                <GuidanceIcon onClick={guidancePanelState.toggle} />
                <GuidancePanel
                  isOpen={guidancePanelState.isOpen}
                  toggle={guidancePanelState.toggle}
                >
                  {OrganizationSettingsHelp.homeScreenTitles}
                </GuidancePanel>
              </HelpInfo>
            )}
          </WithToggle>
        </SubcardBody>
      </Subcard>
    )}
  </WithToggle>
));

HomeScreenSubcard.propTypes = {
  loading: PropTypes.bool,
  organization: PropTypes.object,
};

export default HomeScreenSubcard;
