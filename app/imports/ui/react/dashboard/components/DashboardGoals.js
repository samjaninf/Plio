import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import pluralize from 'pluralize';

import {
  DashboardStatsExpandable,
  IconLoading,
  PlusButton,
} from '../../components';
import {
  GoalsChartContainer,
  GoalAddModalContainer,
  GoalEditModalContainer,
  CompletedDeletedGoalsContainer,
} from '../../goals';

const DashboardGoals = ({
  totalCount,
  goals,
  toggle,
  isOpen,
  loading,
  isAddModalOpen,
  toggleAddModal,
  user,
  organizationId,
  isEditModalOpen,
  toggleEditModal,
  deletedItemsPerRow,
  timeScale,
  canEditGoals,
}) => (
  <DashboardStatsExpandable
    items={goals}
    total={totalCount}
    itemsPerRow={goals.length}
    renderIcon={loading ? () => <IconLoading /> : undefined}
    render={({ items }) => (
      <Fragment>
        {!!items.length && (
          <GoalsChartContainer
            {...{ timeScale }}
            goals={items}
          />
        )}
        <CompletedDeletedGoalsContainer
          {...{
            canEditGoals,
            organizationId,
            deletedItemsPerRow,
          }}
        />
      </Fragment>
    )}
    {...{ toggle, isOpen }}
  >
    {canEditGoals && <PlusButton size="1" onClick={toggleAddModal} />}
    {totalCount
      ? pluralize('goal', totalCount || goals.length, true)
      : 'Add a key goal'}
    {canEditGoals && (
      <GoalAddModalContainer
        isOpen={isAddModalOpen}
        toggle={toggleAddModal}
        owner={user}
        {...{ organizationId }}
      />
    )}
    {!!goals.length && (
      <GoalEditModalContainer
        isOpen={isEditModalOpen}
        toggle={toggleEditModal}
        {...{ organizationId, canEditGoals }}
      />
    )}
  </DashboardStatsExpandable>
);

DashboardGoals.propTypes = {
  totalCount: PropTypes.number.isRequired,
  goals: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isAddModalOpen: PropTypes.bool.isRequired,
  toggleAddModal: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  user: PropTypes.object.isRequired,
  organizationId: PropTypes.string.isRequired,
  isEditModalOpen: PropTypes.bool.isRequired,
  toggleEditModal: PropTypes.func.isRequired,
  timeScale: PropTypes.number.isRequired,
  limit: PropTypes.number,
  canEditGoals: PropTypes.bool,
  deletedItemsPerRow: PropTypes.number,
};

export default DashboardGoals;
