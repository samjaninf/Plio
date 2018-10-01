import React from 'react';

import { ImportanceValues } from '../../../../share/constants';
import { SelectRadioField } from '../../components';

const options = ImportanceValues.map(n => ({ label: n, value: n }));

const ImportanceField = props => (
  <SelectRadioField {...{ options, ...props }} />
);

export default ImportanceField;
