import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import { pickNonInt } from 'plio-util';

import { CustomerElementStatuses } from '../../../../share/constants';
import FormControlStatic from '../../forms/components/FormControlStatic';

const CustomerElementStatusField = ({ status, className, ...props }) => (
  <FormControlStatic
    className={cx(
      {
        'text-success': status === CustomerElementStatuses.MATCHED,
        'text-danger': status === CustomerElementStatuses.UNMATCHED,
      },
      className,
    )}
    {...props}
  >
    {CustomerElementStatuses[status]}
  </FormControlStatic>
);

CustomerElementStatusField.propTypes = {
  status: PropTypes.oneOf(Object.values(pickNonInt(CustomerElementStatuses))).isRequired,
  className: PropTypes.string,
};

export default CustomerElementStatusField;
