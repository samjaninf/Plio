import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { prop, propOr } from 'ramda';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { VictoryChart, VictoryAxis } from 'victory';
import { debounceHandlers } from '../../helpers';
import { getScaleDates, getTimelineListProps } from './helpers';

import TimelineAxis from './TimelineAxis';

const TimelineChartWrapper = styled.div`
  position: relative;
`;

const CurrentDateLine = styled.div`
  height: 100%;
  width: 2px;
  position: absolute;
  background: #d5d5d5;
  ${({ partOfPastTime }) => css`
    left: ${partOfPastTime * 100}%
  `}
`;

const TimelineListWrapper = styled.div`
  position: relative;
  white-space: nowrap;
  top: -7px;
  left: ${propOr(0, 'left')}%;
  width: ${propOr('auto', 'width')}%;
  ${({ float }) => float && css`
    float: ${float};
    & > div {
      text-align: ${float};
    }
  `}
`;

const enhance = compose(
  withState('width', 'setWidth', prop('maxWidth')),
  withHandlers({
    updateWidth: ({ maxWidth, width, setWidth }) => () => {
      const windowWidth = window.innerWidth;
      const newWidth = windowWidth > maxWidth ? maxWidth : windowWidth;
      if (newWidth !== width) {
        setWidth(newWidth);
      }
    },
  }),
  debounceHandlers(['updateWidth'], 200),
  lifecycle({
    componentDidMount() {
      this.props.updateWidth();
      window.addEventListener('resize', this.props.updateWidth);
    },
    componentWillUnmount() {
      window.removeEventListener('resize', this.props.updateWidth);
    },
  }),
);

const TimelineChart = ({
  partOfPastTime,
  items,
  scaleType,
  renderLine,
  renderTimelineList,
  lineHeight,
  axisHeight,
  ...props
}) => {
  const scaleDates = getScaleDates(scaleType, partOfPastTime);
  const chartOptions = {
    scale: { x: 'time', y: 'linear' },
    domainPadding: { x: [7, 7] },
    padding: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    domain: {
      x: [scaleDates.start, scaleDates.end],
      y: [-1, items.length],
    },
    ...props,
  };

  return (
    <TimelineChartWrapper>
      <CurrentDateLine {...{ partOfPastTime }} />
      {items.map(item => (
        <Fragment key={item._id}>
          <VictoryChart
            height={lineHeight}
            {...chartOptions}
          >
            <VictoryAxis style={{ axis: { stroke: 'none' } }} />
            {renderLine({ item, scaleDates })}
          </VictoryChart>

          {renderTimelineList && (
            <TimelineListWrapper
              {...getTimelineListProps(scaleDates, item.startDate, item.endDate)}
            >
              {renderTimelineList({ item })}
            </TimelineListWrapper>
          )}
        </Fragment>
      ))}
      <TimelineAxis {...chartOptions} height={axisHeight} />
    </TimelineChartWrapper>
  );
};

TimelineChart.propTypes = {
  ...VictoryChart.propTypes,
  items: PropTypes.array.isRequired,
  scaleType: PropTypes.number.isRequired,
  renderLine: PropTypes.func.isRequired,
  renderTimelineList: PropTypes.func,
  partOfPastTime: PropTypes.number,
  lineHeight: PropTypes.number,
  axisHeight: PropTypes.number,
};

export default enhance(TimelineChart);
