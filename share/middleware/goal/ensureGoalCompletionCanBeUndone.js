import { canGoalCompletionBeUndone } from '../../checkers';
import Errors from '../../errors';

export default () => async (next, root, args, context) => {
  const { doc, userId } = context;

  if (!canGoalCompletionBeUndone(doc, userId)) {
    throw new Error(Errors.DOC_CANNOT_UNDO_COMPLETION);
  }

  return next(root, args, context);
};
