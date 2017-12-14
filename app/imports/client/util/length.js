import { compose, view, length } from 'ramda';
import lenses from './lenses';

// ({ standards: Array }) => Number | Any
export const getStandardsLength = compose(length, view(lenses.standards));
