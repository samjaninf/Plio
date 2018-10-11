import React from 'react';

import { StandardStatusTypes, StandardStatuses } from '../../../../share/constants';
import { SelectRadioField } from '../../components';

const statusOptions = [
  { label: StandardStatuses[StandardStatusTypes.ISSUED], value: StandardStatusTypes.ISSUED },
  { label: StandardStatuses[StandardStatusTypes.DRAFT], value: StandardStatusTypes.DRAFT },
];

const StandardStatusField = props => (
  <SelectRadioField {...props} options={statusOptions} />
);

export default StandardStatusField;
