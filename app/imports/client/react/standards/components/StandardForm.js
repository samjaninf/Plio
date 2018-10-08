import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'plio-util';

import { StringLimits, StandardStatusTypes, StandardStatuses } from '../../../../share/constants';
import { OrgUsersSelectInputContainer } from '../../containers';
import StandardTypeSelectContainer from '../containers/StandardTypeSelectContainer';

import {
  FormField,
  InputField,
  SelectInputField,
  SelectRadioField,
  SelectField,
} from '../../components';

const statusOptions = [
  { label: StandardStatuses[StandardStatusTypes.ISSUED], value: StandardStatusTypes.ISSUED },
  { label: StandardStatuses[StandardStatusTypes.DRAFT], value: StandardStatusTypes.DRAFT },
];

const StandardForm = ({
  organizationId,
  sequentialId,
  save = noop,
}) => (
  <Fragment>
    <FormField>
      Document title
      <InputField
        name="title"
        placeholder="Title"
        onBlur={save}
        addon={sequentialId}
        maxLength={StringLimits.title.max}
      />
    </FormField>
    <FormField>
      Type
      <StandardTypeSelectContainer
        name="type"
        onChange={save}
        component={SelectField}
        {...{ organizationId }}
      />
    </FormField>
    <FormField>
      Owner
      <OrgUsersSelectInputContainer
        name="owner"
        placeholder="Owner"
        component={SelectInputField}
        onChange={save}
        {...{ organizationId }}
      />
    </FormField>
    <FormField>
      Status
      <SelectRadioField
        name="status"
        onChange={save}
        options={statusOptions}
      />
    </FormField>
  </Fragment>
);

StandardForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  sequentialId: PropTypes.string,
  save: PropTypes.func,
};

export default StandardForm;
