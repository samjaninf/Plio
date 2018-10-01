import PropTypes from 'prop-types';
import React from 'react';

import MatchMakerPieSlice from './MatchMakerPieSlice';

const MatchMakerLeftPieSlice = ({ label, text, ...props }) => (
  <MatchMakerPieSlice
    alignLeft
    // eslint-disable-next-line max-len
    d="M 272,439 C 151.6,439 54,341.4 54,221 54,100.6 151.6,3 272,3 L 272,439 Z M 272,439"
    {...props}
  >
    <text fontSize="28" x="104.55" y="190">
      <tspan x="145" y="216">{label}</tspan>
    </text>
    <text fontSize="20" x="134.26" y="225">
      <tspan x="145" y="244">{text}</tspan>
    </text>
  </MatchMakerPieSlice>
);

MatchMakerLeftPieSlice.propTypes = {
  label: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default MatchMakerLeftPieSlice;
