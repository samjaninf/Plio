import PropTypes from 'prop-types';
import React from 'react';

import MatchMakerPieSlice from './MatchMakerPieSlice';

const MatchMakerTopPieSlice = ({ label, text, ...props }) => (
  <MatchMakerPieSlice
    alignLeft
    d="M 1,2 L 419,2 419,210 1,210 1,2 Z M 1,2"
    {...props}
  >
    <text fontSize="28" x="158.93" y="63">
      <tspan x="210" y="90">{label}</tspan>
    </text>
    <text fontSize="20" x="146.08" y="103">
      <tspan x="210" y="122">{text}</tspan>
    </text>
  </MatchMakerPieSlice>
);

MatchMakerTopPieSlice.propTypes = {
  label: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default MatchMakerTopPieSlice;
