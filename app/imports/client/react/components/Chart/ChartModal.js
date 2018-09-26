import React from 'react';
import styled from 'styled-components';
import { StyledMixins } from 'plio-util';

import EntityModalNext from '../EntityModalNext/EntityModal';

const StyledEntityModalNext = styled(({ bodyHeight, ...rest }) => <EntityModalNext {...rest} />)`
  display: inline-block;
  width: auto !important;
  height: calc(100vh - 60px);
  .modal-body > .card-block:last-of-type {
    ${({ bodyHeight = 'calc(100vh - 115px)' }) => `
      height: ${bodyHeight};
      width: ${bodyHeight};
    `}
  }
  ${StyledMixins.media.mobile`
    display: block;
    .modal-body .card-block:last-of-type {
      height: auto;
      width: auto;
    }
  `};
`;

const ChartModal = props => (
  <StyledEntityModalNext wrapClassName="chart-modal" {...props} />
);

export default ChartModal;
