import { validate, required } from '../util';

export default validate({
  title: required('Title'),
  percentOfMarketSize: required('% of market size'),
});
