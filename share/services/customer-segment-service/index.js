import insert from './insert';
import update from './update';
import match from './match';
import unmatch from './unmatch';
import deleteRelations from './deleteRelations';
import deleteCustomerSegment from './delete';

export default {
  insert,
  update,
  match,
  unmatch,
  deleteRelations,
  delete: deleteCustomerSegment,
};
