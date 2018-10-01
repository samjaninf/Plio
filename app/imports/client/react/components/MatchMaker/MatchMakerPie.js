import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import is from 'styled-is';
import { StyledMixins } from 'plio-util';

import { Styles } from '../../../../api/constants';
import { Consumer, OpenTabState } from './MatchMaker';

import LeftMatchArrow from './LeftMatchArrow';
import RightMatchArrow from './RightMatchArrow';
import MatchCircle from './MatchCircle';
import MatchSquare from './MatchSquare';
import GiftIcon from '../svg/GiftIcon';
import FaceIcon from '../svg/FaceIcon';

const Wrapper = styled.div`
  ${StyledMixins.media.mobile`
    width: 200px;
    margin: 0 auto 1rem;
  `}

  ${StyledMixins.media.notMobile`
    z-index: 999;
    width: 300px;
    position: absolute;
    left: 50%;
    margin-left: -150px;
    top: 0;
    transition: left .4s ease, margin-left .4s ease;

    ${is('slideLeft')`
      left: 0% !important;
      margin-left: -120px !important;
    `}

    ${is('slideRight')`
      left: 100% !important;
      margin-left: -160px !important;
    `}
  `}

  text {
    font-family: ${Styles.font.family.segoe.semibold};
    pointer-events: none;
    text-anchor: middle;
  }
`;

const MatchMakerPie = ({
  children,
  viewBox,
  square,
  circle,
  ...props
}) => {
  let viewbox;
  if (square) viewbox = '0 0 470 420';
  else if (circle) viewbox = '0 0 492 440';
  else if (viewBox) viewbox = viewBox;
  else throw new TypeError('[MatchMakerPie]: square, circle or viewBox prop required');

  return (
    <Consumer>
      {({ state: { activeTab } }) => (
        <Wrapper
          slideLeft={activeTab === OpenTabState.RIGHT}
          slideRight={activeTab === OpenTabState.LEFT}
          {...props}
        >
          <svg viewBox={viewbox}>
            {children}
            {circle && (
              <Fragment>
                <LeftMatchArrow />
                <MatchCircle />
                <FaceIcon />
              </Fragment>
            )}
            {square && (
              <Fragment>
                <RightMatchArrow />
                <MatchSquare />
                <GiftIcon />
              </Fragment>
            )}
          </svg>
        </Wrapper>
      )}
    </Consumer>
  );
};

MatchMakerPie.propTypes = {
  children: PropTypes.node,
  viewBox: PropTypes.string,
  circle: PropTypes.bool,
  square: PropTypes.bool,
};

export default MatchMakerPie;
