import { validate, required } from '../util';

export default validate({
  title: required('Title'),
  percentOfRevenue: required('% of revenue'),
  percentOfProfit: required('% of profit'),
});
