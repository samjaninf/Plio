/* eslint-disable react/prop-types */

import React from 'react';
import Loadable from 'react-loadable';
import { pure } from 'recompose';

import { BubbleDefaultOptions, ChartDefaultOptions } from './constants';
import { PreloaderPage } from '../';

const LoadableBubbleChart = Loadable({
  loader: () => import('react-chartjs-2'),
  loading: () => <PreloaderPage />,
  render: ({ Bubble }, {
    title,
    options,
    xScaleLabels,
    yScaleLabels,
    xTitle,
    yTitle,
    valueFormatter,
    ...props
  }) => (
    <Bubble
      options={{
        title: {
          display: !!title,
          text: title,
          ...ChartDefaultOptions.TITLE,
        },
        legend: ChartDefaultOptions.LEGEND,
        tooltips: {
          displayColors: false,
          callbacks: {
            title(tooltipItem, data) {
              const { datasetIndex } = tooltipItem[0];
              return data.datasets[datasetIndex].label;
            },
            label({ xLabel, yLabel }) {
              return [
                `${xTitle || BubbleDefaultOptions.X_TOOLTIP_LABEL}: ${valueFormatter(xLabel)}`,
                `${yTitle || BubbleDefaultOptions.Y_TOOLTIP_LABEL}: ${valueFormatter(yLabel)}`,
              ];
            },
          },
        },
        elements: {
          point: ChartDefaultOptions.POINT,
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: !!xTitle,
              labelString: xTitle,
              fontSize: BubbleDefaultOptions.SCALE_LABEL_SIZE,
            },
            ticks: xScaleLabels && {
              ...BubbleDefaultOptions.TICKS,
              maxTicksLimit: xScaleLabels.length,
              callback: (value, index) => xScaleLabels[index],
            },
          }],
          yAxes: [{
            scaleLabel: {
              display: !!yTitle,
              labelString: yTitle,
              fontSize: BubbleDefaultOptions.SCALE_LABEL_SIZE,
            },
            ticks: yScaleLabels && {
              ...BubbleDefaultOptions.TICKS,
              maxTicksLimit: yScaleLabels.length,
              callback: (value, index) => yScaleLabels[index],
            },
          }],
        },
        ...options,
      }}
      {...props}
    />
  ),
});

export default pure(LoadableBubbleChart);
