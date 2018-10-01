import PropTypes from 'prop-types';
import React from 'react';
import { TabContent, TabPane, Button } from 'reactstrap';

import { WithState } from '../../helpers';
import { Pull, Icon } from '../../components';

const Tabs = {
  PIE: 'pie',
  MATCHER: 'matcher',
};

const CustomerElementsMatch = ({ renderPie, renderMatcher, ...props }) => (
  <WithState initialState={{ activeTab: Tabs.PIE }}>
    {({ state, setState }) => (
      <TabContent activeTab={state.activeTab}>
        <TabPane tabId={Tabs.PIE}>
          {renderPie({
            setActiveMatcher: () => setState({ activeTab: Tabs.MATCHER }),
            ...props,
          })}
        </TabPane>
        <TabPane tabId={Tabs.MATCHER}>
          {renderMatcher(props)}
          <Pull right>
            <Button onClick={() => setState({ activeTab: Tabs.PIE })}>
              <Icon name="angle-left" margin="right" />
              Back
            </Button>
          </Pull>
        </TabPane>
      </TabContent>
    )}
  </WithState>
);

CustomerElementsMatch.propTypes = {
  renderPie: PropTypes.func.isRequired,
  renderMatcher: PropTypes.func.isRequired,
};

export default CustomerElementsMatch;
