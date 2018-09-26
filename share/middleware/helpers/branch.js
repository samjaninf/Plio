export default (pred, middleware1, middleware2) => async (next, root, args, context) => {
  if (pred(root, args, context)) {
    return middleware1(next, root, args, context);
  }

  if (middleware2) {
    return middleware2(next, root, args, context);
  }

  return next(root, args, context);
};
