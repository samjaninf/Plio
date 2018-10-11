import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import { getUserOptions, lenses, noop, getValues, mapUsersToOptions } from 'plio-util';
import { compose, pick, over, pathOr, repeat } from 'ramda';
import { pure } from 'recompose';
import diff from 'deep-diff';

import { swal } from '../../../util';
import { AWSDirectives, CanvasTypes } from '../../../../share/constants';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { validateKeyResource } from '../../../validation';
import { WithState, Composer } from '../../helpers';
import CanvasForm from './CanvasForm';
import CanvasFilesSubcard from './CanvasFilesSubcard';
import {
  EntityModalNext,
  EntityModalHeader,
  EntityModalBody,
  EntityModalForm,
  RenderSwitch,
  NotifySubcard,
} from '../../components';

const getKeyResource = pathOr({}, repeat('keyResource', 2));
const getInitialValues = compose(
  over(lenses.originator, getUserOptions),
  over(lenses.notify, mapUsersToOptions),
  pick([
    'originator',
    'title',
    'color',
    'notes',
    'notify',
  ]),
  getKeyResource,
);

const KeyResourceEditModal = ({
  isOpen,
  toggle,
  organizationId,
  _id,
}) => (
  <WithState initialState={{ initialValues: {} }}>
    {({ state: { initialValues }, setState }) => (
      <Composer
        components={[
          /* eslint-disable react/no-children-prop */
          <Query
            query={Queries.KEY_RESOURCE_CARD}
            variables={{ _id }}
            skip={!isOpen}
            onCompleted={data => setState({ initialValues: getInitialValues(data) })}
            fetchPolicy={ApolloFetchPolicies.CACHE_AND_NETWORK}
            children={noop}
          />,
          <Mutation mutation={Mutations.UPDATE_KEY_RESOURCE} children={noop} />,
          <Mutation mutation={Mutations.DELETE_KEY_RESOURCE} children={noop} />,
          /* eslint-disable react/no-children-prop */
        ]}
      >
        {([{ data, ...query }, updateKeyResource, deleteKeyResource]) => (
          <EntityModalNext
            {...{ isOpen, toggle }}
            isEditMode
            loading={query.loading}
            error={query.error}
            guidance="Key resource"
            onDelete={() => {
              const { title } = getKeyResource(data);
              swal.promise(
                {
                  text: `The key resource "${title}" will be deleted`,
                  confirmButtonText: 'Delete',
                  successTitle: 'Deleted!',
                  successText: `The key resource "${title}" was deleted successfully.`,
                },
                () => deleteKeyResource({
                  variables: { input: { _id } },
                  refetchQueries: [
                    { query: Queries.CANVAS_PAGE, variables: { organizationId } },
                  ],
                }).then(toggle),
              );
            }}
          >
            <EntityModalForm
              {...{ initialValues }}
              validate={validateKeyResource}
              onSubmit={(values, form) => {
                const currentValues = getInitialValues(data);
                const isDirty = diff(values, currentValues);

                if (!isDirty) return undefined;

                const {
                  title,
                  originator,
                  color,
                  notes = '', // final form sends undefined value instead of an empty string
                  notify = [],
                } = values;

                return updateKeyResource({
                  variables: {
                    input: {
                      _id,
                      title,
                      notes,
                      color,
                      notify: getValues(notify),
                      originatorId: originator.value,
                    },
                  },
                }).then(noop).catch((err) => {
                  form.reset(currentValues);
                  throw err;
                });
              }}
            >
              {({ handleSubmit }) => (
                <Fragment>
                  <EntityModalHeader label="Key resource" />
                  <EntityModalBody>
                    <RenderSwitch
                      require={data.keyResource && data.keyResource.keyResource}
                      errorWhenMissing={noop}
                      loading={query.loading}
                      renderLoading={<CanvasForm {...{ organizationId }} />}
                    >
                      {({ _id: documentId }) => (
                        <Fragment>
                          <CanvasForm {...{ organizationId }} save={handleSubmit} />
                          <CanvasFilesSubcard
                            {...{ documentId, organizationId }}
                            onUpdate={updateKeyResource}
                            slingshotDirective={AWSDirectives.KEY_RESOURCE_FILES}
                            documentType={CanvasTypes.KEY_RESOURCE}
                          />
                          <NotifySubcard
                            {...{ documentId, organizationId }}
                            onChange={handleSubmit}
                          />
                        </Fragment>
                      )}
                    </RenderSwitch>
                  </EntityModalBody>
                </Fragment>
              )}
            </EntityModalForm>
          </EntityModalNext>
        )}
      </Composer>
    )}
  </WithState>
);

KeyResourceEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  _id: PropTypes.string,
};

export default pure(KeyResourceEditModal);
