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
  DepartmentsCreatableField,
  EditSourceField,
} from '../../components';
import { StringLimits } from '../../../../share/constants';
import { OrgUsersSelectInputContainer } from '../../containers';
import StandardTypeSelectContainer from '../containers/StandardTypeSelectContainer';
import StandardStatusField from './StandardStatusField';
import StandardsSectionField from './StandardsSectionField';

const NumberField = styled(InputField)`
  max-width: 75px;
`;

export const StandardEditForm = ({ organizationId, standardId, save }) => (
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
        onChange={save}
      />
    </FormField>
    <FormField>
      Status
      <StandardStatusField name="status" onChange={save} />
    </FormField>
    <FormField>
      Department/sector(s)
      <DepartmentsCreatableField
        name="departments"
        placeholder="Department/sector(s)"
        component={SelectInputField}
        onChange={save}
        {...{ organizationId }}
      />
    </FormField>
    <hr />
    <EditSourceField
      name="source1"
      label="Source file"
      onChange={save}
      {...{ organizationId }}
    />
    <EditSourceField
      name="source2"
      label="Source file 2"
      onChange={save}
      {...{ organizationId, standardId }}
    />
  </Fragment>
);

StandardEditForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  standardId: PropTypes.string.isRequired,
  save: PropTypes.func.isRequired,
};

export default pure(StandardEditForm);
