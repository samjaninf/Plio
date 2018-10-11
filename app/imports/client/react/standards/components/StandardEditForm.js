import React, { Fragment } from 'react';
import { pure } from 'recompose';

import StandardForm from './StandardForm';

export const StandardEditForm = props => (
  <Fragment>
    <StandardForm {...props} />
  </Fragment>
);

export default pure(StandardEditForm);
