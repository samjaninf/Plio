import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { renameKeys } from 'plio-util';

import {
  FormField,
  CardBlock,
  InputField,
  TextareaField,
  DatePickerField,
  LinkedEntityInput,
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

const MilestoneForm = ({
  onChangeTitle,
  onChangeDescription,
  linkedTo,
  onChangeCompletionTargetDate,
  isCompleted,
  onChangeCompletedAt,
  onChangeCompletionComment,
  status,
  color,
}) => (
  <CardBlock>
    <FormField>
      Title
      <InputField
        name="title"
        placeholder="Title"
        onBlur={onChangeTitle}
      />
    </FormField>
    <FormField>
      Description
      <TextareaField
        name="description"
        placeholder="Description"
        onBlur={onChangeDescription}
      />
    </FormField>
    <FormField>
      Linked to
      <LinkedEntityInput disabled {...renameKeys({ title: 'value' }, linkedTo)} />
    </FormField>
    {!!status && (
      <FormField>
        Status
        <StatusField>
          <MilestoneSymbol {...{ status, color }} />
          <StyledSpan>{MilestoneStatuses[status]}</StyledSpan>
        </StatusField>
      </FormField>
    )}
    <FormField>
      Completion - target date
      <DatePickerField
        name="completionTargetDate"
        disabled={isCompleted}
        onChange={onChangeCompletionTargetDate}
        placeholderText="Completion - target date"
      />
    </FormField>
    {isCompleted && (
      <Fragment>
        <FormField>
          Completed on
          <DatePickerField
            name="completedAt"
            onChange={onChangeCompletedAt}
            placeholderText="Completed on"
          />
        </FormField>
        <FormField>
          Comments
          <TextareaField
            name="completionComment"
            onBlur={onChangeCompletionComment}
            placeholder="Comments"
          />
        </FormField>
      </Fragment>
    )}
  </CardBlock>
);

MilestoneForm.propTypes = {
  onChangeTitle: PropTypes.func,
  onChangeDescription: PropTypes.func,
  linkedTo: PropTypes.shape({
    title: PropTypes.string,
    sequentialId: PropTypes.string,
  }).isRequired,
  onChangeCompletionTargetDate: PropTypes.func,
  isCompleted: PropTypes.bool,
  onChangeCompletedAt: PropTypes.func,
  onChangeCompletionComment: PropTypes.func,
  status: PropTypes.number,
  color: PropTypes.string,
};

export default MilestoneForm;
