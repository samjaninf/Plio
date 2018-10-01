import PropTypes from 'prop-types';
import React from 'react';

import MatchMakerPieSlice from './MatchMakerPieSlice';

const MatchMakerRightPieSlice = ({ label, text, ...props }) => (
  <MatchMakerPieSlice
    alignRight
    // eslint-disable-next-line max-len
    d="M 272,438 L 272,3 C 392.4,3 490,100.38 490,220.5 490,340.62 392.4,438 272,438 Z M 272,438"
    {...props}
  >
    <text fontSize="28" x="360.84" y="190">
      <tspan x="400" y="216">{label}</tspan>
    </text>
    <text fontSize="20" x="389.26" y="225">
      <tspan x="400" y="244">{text}</tspan>
    </text>
  </MatchMakerPieSlice>
);

MatchMakerRightPieSlice.propTypes = {
  label: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default MatchMakerRightPieSlice;
