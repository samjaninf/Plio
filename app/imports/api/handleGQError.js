import { replace, map, prop, compose, join, is } from 'ramda';

import { GQ_ERROR_MESSAGE_PREFIX, DEFAULT_ERROR_MESSAGE } from './constants';

const handleErrorMessage = compose(
  replace('; ', ';\n'),
  replace(GQ_ERROR_MESSAGE_PREFIX, ''),
);

const handleGraphQLErrors = compose(
  join('\n\n'),
  map(compose(handleErrorMessage, prop('message'))),
);

export const handleGQError = (error) => {
  if (!error) return '';

  if (is(String, error)) return error;

  const { networkError, graphQLErrors, message } = error;

  if (networkError) {
    return networkError.message;
  }

  if (graphQLErrors) {
    return handleGraphQLErrors(graphQLErrors);
  }

  if (message) {
    return handleErrorMessage(message);
  }

  return DEFAULT_ERROR_MESSAGE;
};
