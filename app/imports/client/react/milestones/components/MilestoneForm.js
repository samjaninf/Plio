import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { Field } from 'react-final-form';

import {
  FormField,
  CardBlock,
  InputField,
  TextareaField,
  DatePickerField,
  FieldCondition,
  FormInput,
} from '../../components';
import MilestoneSymbol from './MilestoneSymbol';
import { MilestoneStatuses } from '../../../../share/constants';

const StatusField = styled.span`
  display: flex;
  align-items: center;
  padding: .375rem 0;
`;

const StyledSpan = styled.span`
  margin-left: 10px;
`;

const MilestoneForm = ({ save }) => (
  <CardBlock>
    <FormField>
      Title
      <InputField
        name="title"
        placeholder="Title"
        onBlur={save}
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
    <Field
      name="linkedTo"
      subscription={{ value: true }}
      render={({ input: { value: linkedTo } }) => linkedTo && (
        <FormField>
          Linked to
          <FormInput
            disabled
            value={linkedTo.label.split(' ').slice(1).join(' ')} // title
            addon={linkedTo.label.split(' ')[0]} // sequentialId
          />
        </FormField>
      )}
    />
    <FieldCondition when="status" is={Boolean}>
      {({ input: { value: status } }) => (
        <FormField>
          Status
          <StatusField>
            <Field name="color" subscription={{ value: true }}>
              {({ input: { value: color } }) => (
                <MilestoneSymbol {...{ color, status }} />
              )}
            </Field>
            <StyledSpan>{MilestoneStatuses[status]}</StyledSpan>
          </StatusField>
        </FormField>
      )}
    </FieldCondition>
    <Field name="isCompleted" subscription={{ value: true }}>
      {({ input: { value: isCompleted } }) => (
        <FormField>
          Completion - target date
          <DatePickerField
            name="completionTargetDate"
            disabled={!!isCompleted}
            onChange={save}
            placeholderText="Completion - target date"
          />
        </FormField>
      )}
    </Field>
    <FieldCondition when="isCompleted" is>
      <FormField>
        Completed on
        <DatePickerField
          name="completedAt"
          onChange={save}
          placeholderText="Completed on"
        />
      </FormField>
      <FormField>
        Comments
        <TextareaField
          name="completionComment"
          onBlur={save}
          placeholder="Comments"
        />
      </FormField>
    </FieldCondition>
  </CardBlock>
);

MilestoneForm.propTypes = {
  save: PropTypes.func,
  isCompleted: PropTypes.bool,
  color: PropTypes.string,
};

export default MilestoneForm;
