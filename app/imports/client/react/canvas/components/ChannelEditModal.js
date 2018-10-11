import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import { getUserOptions, lenses, noop, getValues, mapUsersToOptions } from 'plio-util';
import { compose, pick, over, pathOr, repeat } from 'ramda';
import { pure } from 'recompose';
import diff from 'deep-diff';

import { swal } from '../../../util';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { AWSDirectives, CanvasTypes } from '../../../../share/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { validateChannel } from '../../../validation';
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

const getChannel = pathOr({}, repeat('channel', 2));
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
  getChannel,
);

const ChannelEditModal = ({
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
            query={Queries.CHANNEL_CARD}
            variables={{ _id }}
            skip={!isOpen}
            onCompleted={data => setState({ initialValues: getInitialValues(data) })}
            fetchPolicy={ApolloFetchPolicies.CACHE_AND_NETWORK}
            children={noop}
          />,
          <Mutation mutation={Mutations.UPDATE_CHANNEL} children={noop} />,
          <Mutation mutation={Mutations.DELETE_CHANNEL} children={noop} />,
          /* eslint-disable react/no-children-prop */
        ]}
      >
        {([{ data, ...query }, updateChannel, deleteChannel]) => (
          <EntityModalNext
            {...{ isOpen, toggle }}
            isEditMode
            loading={query.loading}
            error={query.error}
            guidance="Channel"
            onDelete={() => {
              const { title } = getChannel(data);
              swal.promise(
                {
                  text: `The channel "${title}" will be deleted`,
                  confirmButtonText: 'Delete',
                  successTitle: 'Deleted!',
                  successText: `The channel "${title}" was deleted successfully.`,
                },
                () => deleteChannel({
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
              validate={validateChannel}
              onSubmit={(values, form) => {
                const currentValues = getInitialValues(data);
                const isDirty = diff(values, currentValues);

                if (!isDirty) return undefined;

                const {
                  title,
                  originator,
                  color,
                  notes = '',
                  notify = [],
                } = values;

                return updateChannel({
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
                  <EntityModalHeader label="Channel" />
                  <EntityModalBody>
                    <RenderSwitch
                      require={data.channel && data.channel.channel}
                      errorWhenMissing={noop}
                      loading={query.loading}
                      renderLoading={<CanvasForm {...{ organizationId }} />}
                    >
                      {({ _id: documentId, notify }) => (
                        <Fragment>
                          <CanvasForm {...{ organizationId }} save={handleSubmit} />
                          <CanvasFilesSubcard
                            {...{ documentId, organizationId }}
                            onUpdate={updateChannel}
                            slingshotDirective={AWSDirectives.CHANNEL_FILES}
                            documentType={CanvasTypes.CHANNEL}
                          />
                          <NotifySubcard
                            {...{ documentId, notify, organizationId }}
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

ChannelEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  _id: PropTypes.string,
};

export default pure(ChannelEditModal);
