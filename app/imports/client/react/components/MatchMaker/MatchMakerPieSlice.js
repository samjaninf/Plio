import PropTypes from 'prop-types';
import React from 'react';
import is from 'styled-is';
import styled from 'styled-components';

import { Styles } from '../../../../api/constants';

import { Consumer, OpenTabState } from './MatchMaker';

const Slice = styled.path`
  stroke: none;
  fill: ${Styles.color.white};
  cursor: pointer;

  ${is('open')`
    fill: ${Styles.color.lightGrey};
  `}

  &:hover {
    fill: ${Styles.color.lightGrey};
    transition: all 0.4s ease;
  }
`;

const MatchMakerPieSlice = ({
  alignLeft,
  alignRight,
  children,
  ...props
}) => {
  let prop;

  if (alignLeft) prop = OpenTabState.LEFT;
  else if (alignRight) prop = OpenTabState.RIGHT;
  else throw new TypeError('left or right prop required');

  return (
    <Consumer>
      {({ state: { activeTab }, setState }) => (
        <g>
          <Slice
            {...props}
            open={activeTab === prop}
            onClick={() => {
              if (activeTab === prop) {
                setState({ activeTab: OpenTabState.NONE });
              } else {
                setState({ activeTab: prop });
              }
            }}
          />
          {children}
        </g>
      )}
    </Consumer>
  );
};

MatchMakerPieSlice.propTypes = {
  children: PropTypes.node.isRequired,
  alignLeft: PropTypes.bool,
  alignRight: PropTypes.bool,
};

export default MatchMakerPieSlice;
