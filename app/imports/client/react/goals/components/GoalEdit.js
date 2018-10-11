import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { pure } from 'recompose';
import { FormSpy } from 'react-final-form';

import { AWSDirectives, DocumentTypes } from '../../../../share/constants';
import { CardBlock, NotifySubcard } from '../../components';
import GoalMilestonesSubcardContainer from '../containers/GoalMilestonesSubcardContainer';
import GoalRisksSubcardContainer from '../containers/GoalRisksSubcardContainer';
import GoalLessonsSubcardContainer from '../containers/GoalLessonsSubcardContainer';
import GoalActionsSubcardContainer from '../containers/GoalActionsSubcardContainer';
import GoalEditForm from './GoalEditForm';
import GoalCompleteForm from './GoalCompleteForm';
import CanvasFilesSubcard from '../../canvas/components/CanvasFilesSubcard';

export const GoalEdit = ({
  status,
  organizationId,
  sequentialId,
  save,
  _id: goalId,
  canEditGoals,
}) => (
  <Fragment>
    <CardBlock>
      <GoalEditForm
        {...{
          status,
          organizationId,
          sequentialId,
          save,
        }}
      />
      <GoalCompleteForm {...{ organizationId, save }} />
    </CardBlock>
    <GoalActionsSubcardContainer {...{ organizationId, goalId }} />
    <GoalMilestonesSubcardContainer {...{ goalId }} />
    {canEditGoals && <GoalRisksSubcardContainer {...{ organizationId, goalId }} />}
    <GoalLessonsSubcardContainer {...{ goalId }} />
    <FormSpy subscription={{}}>
      {({ form }) => (
        <CanvasFilesSubcard
          {...{ organizationId }}
          documentId={goalId}
          onUpdate={({ variables: { input: { fileIds } } }) => {
            form.change('fileIds', fileIds);
            form.submit();
          }}
          slingshotDirective={AWSDirectives.GOAL_FILES}
          documentType={DocumentTypes.GOAL}
        />
      )}
    </FormSpy>
    <NotifySubcard
      {...{ organizationId }}
      documentId={goalId}
      onChange={save}
    />
  </Fragment>
);

GoalEdit.propTypes = {
  _id: PropTypes.string.isRequired,
  status: PropTypes.number.isRequired,
  organizationId: PropTypes.string,
  sequentialId: PropTypes.string,
  save: PropTypes.func.isRequired,
  canEditGoals: PropTypes.bool,
};

export default pure(GoalEdit);
