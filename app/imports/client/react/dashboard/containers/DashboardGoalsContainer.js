import { graphql } from 'react-apollo';
import {
  renameProps,
  flattenProp,
  setPropTypes,
  onlyUpdateForKeys,
  defaultProps,
  branch,
  renderNothing,
} from 'recompose';
import PropTypes from 'prop-types';
import { byEndDate, byPriority } from 'plio-util';
import { sort, either, when, always, slice, compose, mergeDeepLeft } from 'ramda';
import connectUI from 'redux-ui';

import { namedCompose, withHr, withApolloPreloader } from '../../helpers';
import { DashboardGoals } from '../components';
import {
  WORKSPACE_DEFAULTS,
  WorkspaceDefaultsTypes,
  WorkspaceDefaults,
  UserRoles,
} from '../../../../share/constants';
import { Query } from '../../../graphql';

const sortAndSliceGoals = (limit, goals) => compose(
  when(always(limit), slice(0, limit)),
  sort(either(byPriority, byEndDate)),
)(goals);

export default namedCompose('DashboardGoalsContainer')(
  setPropTypes({
    organization: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      serialNumber: PropTypes.number.isRequired,
      [WORKSPACE_DEFAULTS]: PropTypes.shape({
        [WorkspaceDefaultsTypes.DISPLAY_GOALS]: PropTypes.number,
        [WorkspaceDefaultsTypes.DISPLAY_COMPLETED_DELETED_GOALS]: PropTypes.number,
        [WorkspaceDefaultsTypes.TIME_SCALE]: PropTypes.number,
      }).isRequired,
    }).isRequired,
  }),
  flattenProp('organization'),
  flattenProp(WORKSPACE_DEFAULTS),
  renameProps({
    _id: 'organizationId',
    [WorkspaceDefaultsTypes.DISPLAY_GOALS]: 'limit',
    [WorkspaceDefaultsTypes.DISPLAY_COMPLETED_DELETED_GOALS]: 'completedDeletedItemsPerRow',
    [WorkspaceDefaultsTypes.TIME_SCALE]: 'timeScale',
  }),
  defaultProps({
    limit: WorkspaceDefaults[WorkspaceDefaultsTypes.DISPLAY_GOALS],
    timeScale: WorkspaceDefaults[WorkspaceDefaultsTypes.TIME_SCALE],
    // eslint-disable-next-line max-len
    completedDeletedItemsPerRow: WorkspaceDefaults[WorkspaceDefaultsTypes.DISPLAY_COMPLETED_DELETED_GOALS],
  }),
  onlyUpdateForKeys(['organizationId', 'completedDeletedItemsPerRow', 'timeScale', 'limit']),
  connectUI({
    state: {
      isOpen: false,
      isEditModalOpen: false,
      isMilestoneModalOpen: false,
      isActionModalOpen: false,
      activeGoal: null,
      activeMilestone: null,
      activeAction: null,
    },
  }),
  graphql(Query.DASHBOARD_GOALS, {
    options: ({ limit, organizationId }) => ({
      variables: {
        organizationId,
        limit,
      },
      notifyOnNetworkStatusChange: true,
    }),
    props: ({
      data: {
        loading,
        fetchMore,
        networkStatus,
        goals: {
          totalCount,
          goals = [],
        } = {},
        completedDeletedGoals: {
          totalCount: completedDeletedTotalCount,
        } = {},
        me: user = { roles: [] },
      },
      ownProps: {
        ui: {
          isOpen,
          isEditModalOpen,
          isMilestoneModalOpen,
          isActionModalOpen,
        },
        organizationId,
        updateUI,
        limit,
      },
    }) => ({
      isOpen,
      isEditModalOpen,
      isMilestoneModalOpen,
      isActionModalOpen,
      loading,
      totalCount,
      completedDeletedTotalCount,
      networkStatus,
      user,
      organizationId,
      goals: sortAndSliceGoals(isOpen ? 0 : limit, goals),
      canEditGoals: user.roles.includes(UserRoles.CREATE_DELETE_GOALS),
      toggle: async () => {
        if (!isOpen && goals.length < totalCount) {
          await fetchMore({
            variables: {
              limit: totalCount,
            },
            updateQuery: (prev, { fetchMoreResult }) => mergeDeepLeft(fetchMoreResult, prev),
          });
        }
        updateUI({ isOpen: !isOpen });
      },
      toggleEditModal: () => updateUI('isEditModalOpen', !isEditModalOpen),
      toggleMilestoneModal: () =>
        updateUI('isMilestoneModalOpen', !isMilestoneModalOpen),
      toggleActionModal: () =>
        updateUI('isActionModalOpen', !isActionModalOpen),
    }),
  }),
  withApolloPreloader(),
  branch(
    ({ totalCount, canEditGoals }) => !!totalCount || canEditGoals,
    withHr,
    renderNothing,
  ),
)(DashboardGoals);
