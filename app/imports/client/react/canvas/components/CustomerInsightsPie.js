import PropTypes from 'prop-types';
import React from 'react';

import {
  MatchMaker,
  MatchMakerPane,
  MatchMakerPie,
  MatchMakerLeftPieSlice,
  MatchMakerRightPieSlice,
  MatchButton,
  MatchMakerTabs,
} from '../../components';
import { getMatchText } from '../helpers';
import CustomerNeeds from './CustomerNeeds';
import CustomerWants from './CustomerWants';

const CustomerInsightsPie = ({
  needs,
  wants,
  organizationId,
  documentId,
  documentType,
  setActiveMatcher,
}) => (
  <MatchMaker>
    <MatchMakerPie circle>
      <MatchMakerLeftPieSlice label="Needs" text={getMatchText(needs)} />
      <MatchMakerRightPieSlice label="Wants" text={getMatchText(wants)} />
    </MatchMakerPie>
    <MatchButton
      alignLeft
      onClick={setActiveMatcher}
    >
      Match
    </MatchButton>
    <MatchMakerTabs>
      <MatchMakerPane alignLeft>
        <CustomerNeeds
          {...{
            organizationId,
            documentId,
            documentType,
            needs,
          }}
        />
      </MatchMakerPane>
      <MatchMakerPane alignRight>
        <CustomerWants
          {...{
            organizationId,
            documentId,
            documentType,
            wants,
          }}
        />
      </MatchMakerPane>
    </MatchMakerTabs>
  </MatchMaker>
);

CustomerInsightsPie.propTypes = {
  organizationId: PropTypes.string.isRequired,
  documentId: PropTypes.string.isRequired,
  documentType: PropTypes.string.isRequired,
  needs: PropTypes.arrayOf(PropTypes.object).isRequired,
  wants: PropTypes.arrayOf(PropTypes.object).isRequired,
  setActiveMatcher: PropTypes.func,
};

export default CustomerInsightsPie;
