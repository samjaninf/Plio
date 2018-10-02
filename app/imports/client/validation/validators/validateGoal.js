import { validate, required } from '../util';

export default validate({
  title: required('Title'),
  endDate: required('End date'),
});
