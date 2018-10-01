import PropTypes from 'prop-types';
import React from 'react';
import { TabPane } from 'reactstrap';
import is from 'styled-is';
import styled from 'styled-components';
import { StyledMixins } from 'plio-util';

import { OpenTabState } from './MatchMaker';

const MatchMakerPane = styled(({ alignLeft, alignRight, ...rest }) => <TabPane {...rest} />).attrs({
  tabId: ({ alignLeft, alignRight, tabId }) => {
    if (alignLeft) return OpenTabState.LEFT;
    if (alignRight) return OpenTabState.RIGHT;
    return tabId;
  },
})`
  ${StyledMixins.media.notMobile`
    ${is('alignLeft')`
      margin-right: 170px;
    `}

    ${is('alignRight')`
      margin-left: 170px;
    `}
  `}

  ${StyledMixins.media.mobile`
    margin-left: -1.25rem;
    margin-right: -1.25rem;

    & > .card {
      width: auto;
      margin-left: inherit;
      margin-right: inherit;
      border-top: 1px solid #ddd;
    }
  `}
`;

MatchMakerPane.propTypes = {
  tabId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  alignLeft: PropTypes.bool,
  alignRight: PropTypes.bool,
};

export default MatchMakerPane;
