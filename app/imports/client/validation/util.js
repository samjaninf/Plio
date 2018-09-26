import { FORM_ERROR } from 'final-form';
import { forEachObjIndexed, curry, isNil, isEmpty, anyPass } from 'ramda';

const isNilOrEmpty = anyPass([isNil, isEmpty]);

export const required = curry((label, value) =>
  isNilOrEmpty(value) ? `${label} required` : undefined);

export const validate = rules => (values) => {
  const errors = new Set();

  forEachObjIndexed((value, key) => {
    if (rules[key]) {
      const error = rules[key](value, values);
      if (error) errors.add(error);
    }
  }, values);

  if (!errors.size) return undefined;

  return { [FORM_ERROR]: [...errors].join('\n') };
};
