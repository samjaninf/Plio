import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { sum, append, map, addIndex } from 'ramda';
import { pure } from 'recompose';

import { CanvasDoughnutChartSize } from '../../../../api/constants';
import { MAX_TOTAL_PERCENT, Colors } from '../../../../share/constants';
import { LoadableDoughnutChart, CardBlock } from '../../components';

const StyledCardBlock = styled(CardBlock)`
  .modal-dialog &.card-block.card-body {
    border-top: none;
    padding-top: 0;
  }
`;

const palette = Object.values(Colors);
const generateColors = addIndex(map)((item, index) => palette[index % palette.length]);

const CanvasDoughnutChart = ({
  data,
  labels,
  colors = generateColors(data),
  ...props
}) => {
  const otherPercentage = MAX_TOTAL_PERCENT - sum(data);
  const isOtherPart = otherPercentage > 0;

  return (
    <StyledCardBlock>
      <LoadableDoughnutChart
        {...props}
        width={CanvasDoughnutChartSize.WIDTH}
        height={CanvasDoughnutChartSize.HEIGHT}
        data={{
          datasets: [{
            data: isOtherPart ? append(otherPercentage, data) : data,
            backgroundColor: colors,
          }],
          labels: isOtherPart ? append('Other', labels) : labels,
        }}
      />
    </StyledCardBlock>
  );
};

CanvasDoughnutChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number),
  colors: PropTypes.arrayOf(PropTypes.string),
  labels: PropTypes.arrayOf(PropTypes.string),
};

export default pure(CanvasDoughnutChart);
