import { graphql } from 'react-apollo';
import { Cache, lenses, viewEq, getUserOptions, bySerialNumber } from 'plio-util';
import { view, ifElse, sort } from 'ramda';
import { withHandlers, pure } from 'recompose';

import { RisksSubcard } from '../../risks';
import { Mutation, Fragment, Query } from '../../../graphql';
import { namedCompose } from '../../helpers';
import { swal } from '../../../util';
import { updateGoalFragment } from '../../../apollo';
import { ProblemMagnitudes } from '../../../../share/constants';
import { ApolloFetchPolicies } from '../../../../api/constants';

export default namedCompose('GoalRisksSubcardContainer')(
  pure,
  graphql(Query.GOAL_RISKS_CARD, {
    options: ({ goalId, organizationId }) => ({
      variables: { _id: goalId, organizationId },
      fetchPolicy: ApolloFetchPolicies.CACHE_AND_NETWORK,
    }),
    props: ({
      data: {
        user,
        riskTypes: { riskTypes = [] } = {},
        goal: {
          goal: {
            _id,
            title,
            sequentialId,
            risks = [],
            organization: { rkGuidelines: guidelines } = {},
          } = {},
        } = {},
      },
    }) => ({
      guidelines,
      user,
      riskTypes,
      linkedTo: {
        _id,
        title,
        sequentialId,
      },
      initialValues: {
        active: 0,
        owner: getUserOptions(user),
        originator: getUserOptions(user),
        type: view(lenses.head._id, riskTypes),
        magnitude: ProblemMagnitudes.MAJOR,
      },
      risks: sort(bySerialNumber, risks),
    }),
  }),
  graphql(Mutation.LINK_RISK_TO_GOAL, {
    props: ({
      mutate,
      ownProps: {
        linkedTo,
      },
    }) => ({
      linkRiskToGoal: async ({ risk: { value: riskId } = {} }) => {
        if (!riskId) throw new Error('Risk is required');

        return mutate({
          variables: {
            input: {
              riskId,
              _id: linkedTo._id,
            },
          },
          update: (proxy, { data: { linkRiskToGoal: { risk } } }) => updateGoalFragment(
            Cache.addRisk(risk),
            {
              id: linkedTo._id,
              fragment: Fragment.GOAL_CARD,
            },
            proxy,
          ),
        });
      },
    }),
  }),
  graphql(Mutation.CREATE_RISK, {
    props: ({
      mutate,
      ownProps: {
        organizationId,
        linkedTo,
      },
    }) => ({
      createRisk: async ({
        title,
        description,
        originator: { value: originatorId },
        owner: { value: ownerId },
        magnitude,
        type: typeId,
      }) => {
        if (!title) throw new Error('Title is required');

        return mutate({
          variables: {
            input: {
              title,
              description,
              originatorId,
              ownerId,
              magnitude,
              typeId,
              organizationId,
              goalId: linkedTo._id,
            },
          },
          update: (proxy, { data: { createRisk: { risk } } }) => updateGoalFragment(
            Cache.addRisk(risk),
            {
              id: linkedTo._id,
              fragment: Fragment.GOAL_CARD,
            },
            proxy,
          ),
        });
      },
    }),
  }),
  withHandlers({
    onSave: ({ linkRiskToGoal, createRisk }) => ifElse(
      viewEq(0, lenses.active),
      createRisk,
      linkRiskToGoal,
    ),
  }),
  graphql(Mutation.DELETE_RISK, {
    props: ({
      mutate,
      ownProps: { linkedTo },
    }) => ({
      onDelete: (e, {
        entity: { _id, title },
      }) => swal.promise({
        text: `The risk "${title}" will be deleted`,
        confirmButtonText: 'Delete',
      }, () => mutate({
        variables: {
          input: { _id },
        },
        update: updateGoalFragment(Cache.deleteRiskById(_id), {
          id: linkedTo._id,
          fragment: Fragment.GOAL_CARD,
        }),
      })),
    }),
  }),
)(RisksSubcard);
