import { validate, required } from '../util';

export default validate({
  title: required('Title'),
  notes: required('Notes'),
});
