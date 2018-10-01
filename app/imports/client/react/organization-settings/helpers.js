import { curry } from 'ramda';

export const createWorkspaceTitleValue = (key, value) => `${key}(${value})`;

export const getWorkspaceTitleOption = curry((titleType, title) => ({
  label: title,
  value: createWorkspaceTitleValue(titleType, title),
}));
