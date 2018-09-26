import insert from './insert';
import update from './update';
import deleteValueProposition from './delete';
import deleteRelations from './deleteRelations';
import unmatch from './unmatch';
import match from './match';

export default {
  insert,
  update,
  deleteRelations,
  unmatch,
  match,
  delete: deleteValueProposition,
};
