import { validate, required } from '../util';

export default validate({
  title: required('Title'),
  percentOfTotalCost: required('% of total cost'),
});
