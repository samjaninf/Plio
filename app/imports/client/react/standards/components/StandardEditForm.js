import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';
import styled from 'styled-components';

import {
  FormField,
  InputField,
  SelectInputField,
  SelectField,
  TextareaField,
} from '../../components';
import { StringLimits } from '../../../../share/constants';
import { OrgUsersSelectInputContainer } from '../../containers';
import StandardTypeSelectContainer from '../containers/StandardTypeSelectContainer';
import StandardStatusField from './StandardStatusField';
import StandardsSectionField from './StandardsSectionField';
// import StandardsDepartmentsField from './StandardsDepartmentsField';

const NumberField = styled(InputField)`
  max-width: 75px;
`;

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
      Description
      <TextareaField
        name="description"
        placeholder="Description"
        onBlur={save}
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
        name="typeId"
        component={SelectField}
        onChange={save}
        {...{ organizationId }}
      />
    </FormField>
    <FormField>
      Unique number
      <NumberField
        name="uniqueNumber"
        type="number"
        placeholder="#"
        min={1}
        max={10000}
        onChange={save}
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
      Issue number
      <NumberField
        name="issueNumber"
        type="number"
        min={1}
        max={1000}
        onChange={save}
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
