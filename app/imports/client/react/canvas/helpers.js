import {
  compose,
  join,
  flatten,
  juxt,
  prepend,
  append,
  of,
  length,
  ifElse,
  always,
  filter,
  whereEq,
} from 'ramda';

import {
  ImportanceValues,
  CustomerElementStatuses,
  Criticality,
  CriticalityLevels,
} from '../../../share/constants';

export const getCustomerElementInitialValues = () => ({
  title: '',
  description: '',
  importance: ImportanceValues[0],
});

export const getMatchText = compose(
  join(''),
  flatten,
  juxt([
    compose(
      prepend('('),
      of,
      length,
    ),
    compose(
      ifElse(
        length,
        compose(
          append(' matched'),
          prepend(', '),
          of,
          length,
        ),
        always(''),
      ),
      filter(whereEq({ status: CustomerElementStatuses.MATCHED })),
    ),
    always(')'),
  ]),
);

const {
  [Criticality.VERY_LOW]: veryLow,
  [Criticality.LOW]: low,
  [Criticality.MEDIUM]: medium,
  [Criticality.HIGH]: high,
  [Criticality.VERY_HIGH]: veryHigh,
} = CriticalityLevels;

export const getCriticalityLevelLabel = (value) => {
  if (value <= veryLow.max) {
    return veryLow.label;
  } else if (value <= low.max) {
    return low.label;
  } else if (value <= medium.max) {
    return medium.label;
  } else if (value <= high.max) {
    return high.label;
  }
  return veryHigh.label;
};

export const getCriticalityValueLabel = value => `${getCriticalityLevelLabel(value)} - ${value}%`;
