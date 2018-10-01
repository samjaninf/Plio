import PropTypes from 'prop-types';
import React from 'react';
import { InputGroup, Input } from 'reactstrap';

import { FormField, InputGroupAddon } from '../../../../../components';
import SequentialId from '../../../read/components/SequentialId';

const OrgName = ({ name, serialNumber }) => (
  <FormField>
    <span>Org name</span>
    <InputGroup>
      <InputGroupAddon addonType="prepend">
        <SequentialId {...{ serialNumber }} />
      </InputGroupAddon>
      <Input readOnly disabled value={name} />
    </InputGroup>
  </FormField>
);

OrgName.propTypes = {
  name: PropTypes.string.isRequired,
  serialNumber: PropTypes.number.isRequired,
};

export default OrgName;
