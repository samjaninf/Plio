import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { pure } from 'recompose';
import { noop } from 'plio-util';

import {
  FormField,
  InputField,
  TextareaField,
  SelectInputField,
  DatePickerField,
  Magnitudes,
  SelectField,
  ColorPickerField,
} from '../../components';
import { OrgUsersSelectInputContainer } from '../../containers';
import { StringLimits } from '../../../../share/constants';

export const GoalForm = ({
  organizationId,
  sequentialId,
  save = noop,
}) => (
  <Fragment>
    <FormField>
      Key goal name
      <InputField
        name="title"
        placeholder="Key goal name"
        onBlur={save}
        addon={sequentialId}
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
      Start date
      <DatePickerField
        name="startDate"
        onChange={save}
        placeholderText="Start date"
      />
    </FormField>
    <FormField>
      End date
      <DatePickerField
        name="endDate"
        onChange={save}
        placeholderText="End date"
      />
    </FormField>
    <FormField>
      Priority
      <Magnitudes.Select
        name="priority"
        onChange={save}
        component={SelectField}
      />
    </FormField>
    <FormField>
      Color
      <ColorPickerField
        name="color"
        onChange={save}
      />
    </FormField>
  </Fragment>
);

GoalForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  sequentialId: PropTypes.string,
  save: PropTypes.func,
};

export default pure(GoalForm);
