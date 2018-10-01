import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import diff from 'deep-diff';
import { noop, generateWorkspaceDefaultsOptions } from 'plio-util';
import { Form } from 'react-final-form';
import { Mutation } from 'react-apollo';
import { pick, values } from 'ramda';

import { swal } from '../../../util';
import { Mutation as Mutations } from '../../../graphql';
import {
  WorkspaceDefaultsTypes,
  WorkspaceDefaultsLabels,
} from '../../../../share/constants';
import {
  SelectInputField,
  FormField,
} from '../../components';

const getInitialValues = pick(values(WorkspaceDefaultsTypes));
const implementationViewDefaultsOptions = generateWorkspaceDefaultsOptions();

const ImplementationViewDefaultsForm = ({ organizationId, workspaceDefaults }) => (
  <Mutation mutation={Mutations.UPDATE_ORGANIZATION_WORKSPACE_DEFAULTS}>
    {changeWorkspaceDefaults => (
      <Form
        subscription={{}}
        initialValues={getInitialValues(workspaceDefaults)}
        onSubmit={(defaultsValues) => {
          const currentValues = getInitialValues(workspaceDefaults);
          const isDirty = diff(defaultsValues, currentValues);

          if (!isDirty) return undefined;

          const {
            [WorkspaceDefaultsTypes.DISPLAY_USERS]: { value: displayUsers },
            [WorkspaceDefaultsTypes.DISPLAY_MESSAGES]: { value: displayMessages },
            [WorkspaceDefaultsTypes.DISPLAY_ACTIONS]: { value: displayActions },
          } = defaultsValues;

          return changeWorkspaceDefaults({
            variables: {
              input: {
                _id: organizationId,
                [WorkspaceDefaultsTypes.DISPLAY_USERS]: displayUsers,
                [WorkspaceDefaultsTypes.DISPLAY_MESSAGES]: displayMessages,
                [WorkspaceDefaultsTypes.DISPLAY_ACTIONS]: displayActions,
              },
            },
          }).then(noop).catch(swal.error);
        }}
      >
        {({ handleSubmit }) => (
          <Fragment>
            <FormField>
              {WorkspaceDefaultsLabels[WorkspaceDefaultsTypes.DISPLAY_USERS]}
              <SelectInputField
                name={WorkspaceDefaultsTypes.DISPLAY_USERS}
                options={implementationViewDefaultsOptions}
                onChange={handleSubmit}
              />
            </FormField>
            <FormField>
              {WorkspaceDefaultsLabels[WorkspaceDefaultsTypes.DISPLAY_MESSAGES]}
              <SelectInputField
                name={WorkspaceDefaultsTypes.DISPLAY_MESSAGES}
                options={implementationViewDefaultsOptions}
                onChange={handleSubmit}
              />
            </FormField>
            <FormField>
              {WorkspaceDefaultsLabels[WorkspaceDefaultsTypes.DISPLAY_ACTIONS]}
              <SelectInputField
                name={WorkspaceDefaultsTypes.DISPLAY_ACTIONS}
                options={implementationViewDefaultsOptions}
                onChange={handleSubmit}
              />
            </FormField>
          </Fragment>
        )}
      </Form>
    )}
  </Mutation>
);

ImplementationViewDefaultsForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  workspaceDefaults: PropTypes.shape({
    [WorkspaceDefaultsTypes.DISPLAY_USERS]: PropTypes.number.isRequired,
    [WorkspaceDefaultsTypes.DISPLAY_MESSAGES]: PropTypes.number.isRequired,
    [WorkspaceDefaultsTypes.DISPLAY_ACTIONS]: PropTypes.number.isRequired,
  }).isRequired,
};

export default ImplementationViewDefaultsForm;
