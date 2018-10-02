import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormSpy, Field } from 'react-final-form';
import { FormGroup, Button, InputGroupButton } from 'reactstrap';
import styled from 'styled-components';

import {
  TextareaField,
  TextAlign,
  FieldCondition,
  FormField,
  DatePickerField,
  UserSelectInput,
  UndoTime,
} from '../../components';
import ToggleComplete from '../../components/ToggleComplete';

const InputGroupWrapper = styled.div`
  display: flex;
  & > div:first-child {
    width: 100%;
  }
  .input-group-btn {
    width: 55px;
  }
`;

export const GoalCompleteForm = ({ organizationId, save }) => (
  <FieldCondition
    when="isCompleted"
    is
    otherwise={(
      <ToggleComplete completeButtonContent="Mark as complete">
        <FormGroup className="margin-top">
          <TextareaField
            name="completionComment"
            placeholder="Enter any completion comments"
          />
        </FormGroup>
        <FormSpy subscription={{ submitting: true }}>
          {({ submitting, form }) => (
            <TextAlign center>
              <div>
                <Button
                  color="success"
                  disabled={submitting}
                  onClick={() => {
                    form.change('isCompleted', true);
                    save();
                  }}
                >
                  Complete
                </Button>
              </div>
            </TextAlign>
          )}
        </FormSpy>
      </ToggleComplete>
    )}
  >
    <Fragment>
      <FormField>
        Completed date
        <DatePickerField
          name="completedAt"
          onChange={save}
          placeholderText="Completed date"
        />
      </FormField>
      <FormField>
        Completed by
        <InputGroupWrapper>
          <UserSelectInput
            name="completedBy"
            placeholder="Completed by"
            onChange={save}
            {...{ organizationId }}
          />
          <FormSpy subscription={{ submitting: true }}>
            {({ submitting, form }) => (
              <InputGroupButton
                addonType="append"
                color="link"
                className="margin-left"
                disabled={submitting}
                onClick={() => {
                  form.change('isCompleted', false);
                  save();
                }}
              >
                Undo
              </InputGroupButton>
            )}
          </FormSpy>
        </InputGroupWrapper>
        <Field name="completedAt" subscription={{ value: true }}>
          {({ input: { value } }) => (
            <UndoTime date={value}>
              {({ passed, left }) => `Completed ${passed}, ${left} left to undo`}
            </UndoTime>
          )}
        </Field>
      </FormField>
      <FormField>
        Completion comments
        <TextareaField
          name="completionComment"
          placeholder="Enter any completion comments"
          onBlur={save}
        />
      </FormField>
    </Fragment>
  </FieldCondition>
);

GoalCompleteForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  save: PropTypes.func.isRequired,
};

export default GoalCompleteForm;
