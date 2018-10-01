/* eslint-disable react/prop-types */

import React from 'react';
import Loadable from 'react-loadable';
import { pure } from 'recompose';

import { ChartDefaultOptions } from './constants';
import { PreloaderPage } from '../';

const LoadableDoughnutChart = Loadable({
  loader: () => import('react-chartjs-2'),
  loading: () => <PreloaderPage />,
  render: ({ Doughnut }, {
    title,
    options,
    valueLabel = title,
    ...props
  }) => (
    <Doughnut
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
              const itemIndex = tooltipItem[0].index;
              return data.labels[itemIndex];
            },
            label(tooltipItem, data) {
              const chartData = data.datasets[0].data;
              return `${chartData[tooltipItem.index]}${valueLabel || ''}`;
            },
          },
        },
        elements: {
          arc: ChartDefaultOptions.ARC,
        },
        ...options,
      }}
      {...props}
    />
  ),
});

export default pure(LoadableDoughnutChart);
