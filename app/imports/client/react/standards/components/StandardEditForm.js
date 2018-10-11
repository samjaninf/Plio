import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';

import {
  FormField,
  InputField,
  SelectInputField,
  SelectField,
} from '../../components';
import { StringLimits } from '../../../../share/constants';
import { OrgUsersSelectInputContainer } from '../../containers';
import StandardTypeSelectContainer from '../containers/StandardTypeSelectContainer';
import StandardStatusField from './StandardStatusField';
import StandardsSectionField from './StandardsSectionField';

export const StandardEditForm = ({ organizationId, save }) => (
  <Fragment>
    <FormField>
      Document title
      <InputField
        name="title"
        placeholder="Title"
        onBlur={save}
        maxLength={StringLimits.title.max}
      />
    </FormField>
    <FormField>
      Standards section
      <StandardsSectionField
        name="section"
        onChange={save}
        {...{ organizationId }}
      />
    </FormField>
    <FormField>
      Type
      <StandardTypeSelectContainer
        name="type"
        component={SelectField}
        onChange={save}
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
      <StandardStatusField name="status" onChange={save} />
    </FormField>
  </Fragment>
);

StandardEditForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  save: PropTypes.func.isRequired,
};

export default pure(StandardEditForm);
