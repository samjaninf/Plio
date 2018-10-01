import PropTypes from 'prop-types';
import React from 'react';

import MatchMakerPieSlice from './MatchMakerPieSlice';

const MatchMakerBottomPieSlice = ({ label, text, ...props }) => (
  <MatchMakerPieSlice
    alignRight
    d="M 1,210 L 419,210 419,419 1,419 1,210 Z M 1,210"
    {...props}
  >
    <text fontSize="28" x="152.81" y="282">
      <tspan x="207" y="309">{label}</tspan>
    </text>
    <text fontSize="20" x="146.08" y="323">
      <tspan x="210" y="342">{text}</tspan>
    </text>
  </MatchMakerPieSlice>
);

MatchMakerBottomPieSlice.propTypes = {
  label: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default MatchMakerBottomPieSlice;
