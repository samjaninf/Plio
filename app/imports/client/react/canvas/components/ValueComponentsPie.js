import PropTypes from 'prop-types';
import React from 'react';

import {
  MatchMaker,
  MatchMakerPane,
  MatchMakerPie,
  MatchMakerTopPieSlice,
  MatchMakerBottomPieSlice,
  MatchButton,
  MatchMakerTabs,
} from '../../components';
import { getMatchText } from '../helpers';
import Benefits from './Benefits';
import Features from './Features';

const ValueComponentsPie = ({
  benefits,
  features,
  organizationId,
  documentId,
  documentType,
  setActiveMatcher,
}) => (
  <MatchMaker>
    <MatchMakerPie square>
      <MatchMakerTopPieSlice
        label="Benefits"
        text={getMatchText(benefits)}
      />
      <MatchMakerBottomPieSlice
        label="Features"
        text={getMatchText(features)}
      />
    </MatchMakerPie>
    <MatchButton alignRight onClick={setActiveMatcher}>Match</MatchButton>
    <MatchMakerTabs>
      <MatchMakerPane alignLeft>
        <Benefits
          {...{
            documentId,
            documentType,
            organizationId,
            benefits,
          }}
        />
      </MatchMakerPane>
      <MatchMakerPane alignRight>
        <Features
          {...{
            documentId,
            documentType,
            organizationId,
            features,
          }}
        />
      </MatchMakerPane>
    </MatchMakerTabs>
  </MatchMaker>
);

ValueComponentsPie.propTypes = {
  organizationId: PropTypes.string.isRequired,
  documentId: PropTypes.string.isRequired,
  documentType: PropTypes.string.isRequired,
  benefits: PropTypes.arrayOf(PropTypes.object).isRequired,
  features: PropTypes.arrayOf(PropTypes.object).isRequired,
  setActiveMatcher: PropTypes.func,
};

export default ValueComponentsPie;
