import PropTypes from 'prop-types';
import React from 'react';
import { pure } from 'recompose';
import {
  pick,
  compose,
  over,
  unless,
  isNil,
  pathOr,
  repeat,
  defaultTo,
  path,
} from 'ramda';
import { Query, Mutation } from 'react-apollo';
import {
  lenses,
  noop,
  toDate,
  getValues,
  mapUsersToOptions,
  getEntityOptions,
  setOver,
} from 'plio-util';
import moment from 'moment';
import diff from 'deep-diff';

import { Composer, WithState, renderComponent } from '../../helpers';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { onDelete } from '../handlers';
import { ApolloFetchPolicies } from '../../../../api/constants';

const getMilestone = pathOr({}, repeat('milestone', 2));
const getInitialValues = compose(
  over(lenses.completionTargetDate, moment),
  over(lenses.completedAt, unless(isNil, moment)),
  over(lenses.notify, compose(mapUsersToOptions, defaultTo([]))),
  over(lenses.linkedTo, getEntityOptions),
  setOver(lenses.color, path(['linkedTo', 'color'])),
  pick([
    'title',
    'description',
    'completionTargetDate',
    'completedAt',
    'isCompleted',
    'completionComments',
    'notify',
    'linkedTo',
    'status',
  ]),
  getMilestone,
);

const MilestoneEditContainer = ({
  milestoneId,
  organizationId,
  isOpen,
  toggle,
  fetchPolicy = ApolloFetchPolicies.CACHE_AND_NETWORK,
  ...props
}) => (
  <WithState initialState={{ milestone: null, initialValues: {} }}>
    {({ state: { initialValues, milestone }, setState }) => (
      <Composer
        components={[
          /* eslint-disable react/no-children-prop */
          <Query
            {...{ fetchPolicy }}
            query={Queries.MILESTONE_CARD}
            variables={{ _id: milestoneId }}
            onCompleted={data => setState({
              initialValues: getInitialValues(data),
              milestone: getMilestone(data),
            })}
            children={noop}
          />,
          <Mutation
            mutation={Mutations.UPDATE_MILESTONE}
            children={noop}
            onCompleted={({ updateMilestone }) => setState({ milestone: updateMilestone })}
          />,
          <Mutation
            mutation={Mutations.DELETE_MILESTONE}
            children={noop}
          />,
          /* eslint-enable react/no-children-prop */
        ]}
      >
        {([
          { data, loading, error },
          updateMilestone,
          deleteMilestone,
        ]) => renderComponent({
          ...props,
          loading,
          error,
          organizationId,
          isOpen,
          toggle,
          initialValues,
          milestone,
          onSubmit: async (values, form) => {
            const currentValues = getInitialValues(data);
            const difference = diff(values, currentValues);

            if (!difference) return undefined;

            const {
              title,
              description = '',
              completionTargetDate,
              completedAt,
              completionComments,
              notify,
            } = values;

            const args = {
              variables: {
                input: {
                  _id: milestone._id,
                  title,
                  description,
                  completionTargetDate: toDate(completionTargetDate),
                  completedAt: unless(isNil, toDate, completedAt),
                  completionComments,
                },
              },
            };

            if (notify) {
              Object.assign(args, { notify: getValues(notify) });
            }

            return updateMilestone(args).then(noop).catch((err) => {
              form.reset(currentValues);
              throw err;
            });
          },
          onDelete: e => onDelete({
            deleteMilestone,
            linkedTo: milestone.linkedTo,
          })(e, { entity: milestone }).then(toggle),
        })}
      </Composer>
    )}
  </WithState>
);

MilestoneEditContainer.propTypes = {
  organizationId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  milestoneId: PropTypes.string.isRequired,
  fetchPolicy: PropTypes.string,
};

export default pure(MilestoneEditContainer);
