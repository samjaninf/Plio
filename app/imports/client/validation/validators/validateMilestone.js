import { validate, required } from '../util';

export default validate({
  title: required('Title'),
  completionTargetDate: required('Completion - target date'),
});
