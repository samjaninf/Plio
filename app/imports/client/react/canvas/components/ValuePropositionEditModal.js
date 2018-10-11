import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import {
  getEntityOptions,
  getUserOptions,
  lenses,
  noop,
  convertDocumentOptions,
  getValues,
  mapUsersToOptions,
} from 'plio-util';
import { compose, pick, over, pathOr, repeat, defaultTo } from 'ramda';
import { pure } from 'recompose';
import diff from 'deep-diff';

import { swal } from '../../../util';
import { AWSDirectives, CanvasTypes } from '../../../../share/constants';
import { ApolloFetchPolicies, OptionNone } from '../../../../api/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { validateValueProposition } from '../../../validation';
import { WithState, Composer } from '../../helpers';
import ValuePropositionForm from './ValuePropositionForm';
import ValueComponentsSubcard from './ValueComponentsSubcard';
import CanvasFilesSubcard from './CanvasFilesSubcard';
import {
  EntityModalNext,
  EntityModalHeader,
  EntityModalBody,
  EntityModalForm,
  RenderSwitch,
  NotifySubcard,
} from '../../components';

const getValueProposition = pathOr({}, repeat('valueProposition', 2));
const getInitialValues = compose(
  over(lenses.matchedTo, compose(defaultTo(OptionNone), getEntityOptions)),
  over(lenses.originator, getUserOptions),
  over(lenses.notify, mapUsersToOptions),
  pick([
    'originator',
    'title',
    'color',
    'matchedTo',
    'notes',
    'notify',
  ]),
  getValueProposition,
);

const ValuePropositionEditModal = ({
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
            query={Queries.VALUE_PROPOSITION_CARD}
            variables={{ _id, organizationId }}
            skip={!isOpen}
            onCompleted={data => setState({ initialValues: getInitialValues(data) })}
            fetchPolicy={ApolloFetchPolicies.CACHE_AND_NETWORK}
            children={noop}
          />,
          <Mutation mutation={Mutations.UPDATE_VALUE_PROPOSITION} children={noop} />,
          <Mutation mutation={Mutations.DELETE_VALUE_PROPOSITION} children={noop} />,
          <Mutation
            mutation={Mutations.MATCH_VALUE_PROPOSITION}
            refetchQueries={() => [{
              query: Queries.CUSTOMER_SEGMENTS,
              variables: { organizationId },
            }]}
            children={noop}
          />,
          /* eslint-disable react/no-children-prop */
        ]}
      >
        {([
          { data, ...query },
          updateValueProposition,
          deleteValueProposition,
          matchValueProposition,
        ]) => (
          <EntityModalNext
            {...{ isOpen, toggle }}
            isEditMode
            loading={query.loading}
            error={query.error}
            guidance="Value proposition"
            onDelete={() => {
              const { title } = getValueProposition(data);
              swal.promise(
                {
                  text: `The value proposition "${title}" will be deleted`,
                  confirmButtonText: 'Delete',
                  successTitle: 'Deleted!',
                  successText: `The value proposition "${title}" was deleted successfully.`,
                },
                () => deleteValueProposition({
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
              validate={validateValueProposition}
              onSubmit={(values, form) => {
                const currentValues = getInitialValues(data);
                const difference = diff(values, currentValues);

                if (!difference) return undefined;

                const {
                  title,
                  originator,
                  color,
                  matchedTo,
                  notes = '',
                  notify = [],
                } = values;

                if (difference[0].path[0] === 'matchedTo') {
                  return matchValueProposition({
                    variables: {
                      input: {
                        _id,
                        matchedTo: convertDocumentOptions({
                          documentType: CanvasTypes.CUSTOMER_SEGMENT,
                        }, matchedTo),
                      },
                    },
                  }).then(noop).catch((err) => {
                    form.reset(currentValues);
                    throw err;
                  });
                }

                return updateValueProposition({
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
                  <EntityModalHeader label="Value proposition" />
                  <EntityModalBody>
                    <RenderSwitch
                      require={data.valueProposition && data.valueProposition.valueProposition}
                      errorWhenMissing={noop}
                      loading={query.loading}
                      renderLoading={<ValuePropositionForm {...{ organizationId }} />}
                    >
                      {({
                        _id: documentId,
                        benefits = [],
                        features = [],
                        matchedTo,
                      }) => (
                        <Fragment>
                          <ValuePropositionForm
                            {...{ organizationId, matchedTo }}
                            save={handleSubmit}
                          />
                          <ValueComponentsSubcard
                            {...{
                              organizationId,
                              benefits,
                              features,
                              documentId,
                              matchedTo,
                            }}
                            documentType={CanvasTypes.VALUE_PROPOSITION}
                          />
                          <CanvasFilesSubcard
                            {...{ organizationId, documentId }}
                            onUpdate={updateValueProposition}
                            slingshotDirective={AWSDirectives.VALUE_PROPOSITION_FILES}
                            documentType={CanvasTypes.VALUE_PROPOSITION}
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

ValuePropositionEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  _id: PropTypes.string,
};

export default pure(ValuePropositionEditModal);
