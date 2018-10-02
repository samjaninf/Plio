import { applyMiddleware } from 'plio-util';

const composeMiddleware = (...middleware) => (next, root, args, context) =>
  applyMiddleware(...middleware)(next)(root, args, context);

export default composeMiddleware;
