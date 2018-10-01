import PropTypes from 'prop-types';
import React from 'react';
import { TabContent } from 'reactstrap';

import { Consumer } from './MatchMaker';

const MatchMakerTabs = ({ children, ...props }) => (
  <Consumer>
    {({ state: { activeTab } }) => (
      <TabContent {...{ activeTab, ...props }}>
        {children}
      </TabContent>
    )}
  </Consumer>
);

MatchMakerTabs.propTypes = {
  children: PropTypes.node,
};

export default MatchMakerTabs;
