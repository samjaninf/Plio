import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { StringLimits } from '../../../../share/constants';
import { OrgUsersSelectInputContainer } from '../../containers';
import StandardTypeSelectContainer from '../containers/StandardTypeSelectContainer';
import StandardsSectionField from './StandardsSectionField';
import StandardStatusField from './StandardStatusField';

import {
  FormField,
  InputField,
  SelectInputField,
  SelectField,
  CreateSourceField,
} from '../../components';

const StandardAddForm = ({ organizationId }) => (
  <Fragment>
    <FormField>
      Document title
      <InputField
        name="title"
        placeholder="Title"
        maxLength={StringLimits.title.max}
      />
    </FormField>
    <FormField>
      Standards section
      <StandardsSectionField name="section" {...{ organizationId }} />
    </FormField>
    <FormField>
      Type
      <StandardTypeSelectContainer
        name="type"
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
        {...{ organizationId }}
      />
    </FormField>
    <FormField>
      Status
      <StandardStatusField name="status" />
    </FormField>
    <CreateSourceField name="source1" />
  </Fragment>
);

StandardAddForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default StandardAddForm;
