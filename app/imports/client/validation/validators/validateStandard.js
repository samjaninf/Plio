import { validate, required } from '../util';

export default validate({
  title: required('Document title'),
  source1: required('Source file'),
  issueNumber: required('Issue number'),
});
