import React from 'react';
import PropTypes from 'prop-types';

import { EntityManagerItem } from '../../../components';
import { StandardAddContainer } from '../../../standards';
import ActivelyManageItem from './ActivelyManageItem';

const StandardActivelyManageItem = ({ organizationId, standards, ...rest }) => (
  <EntityManagerItem
    {...{ organizationId, standards, ...rest }}
    itemId="standard"
    label="Standard"
    component={StandardAddContainer}
    render={ActivelyManageItem}
  >
    Test
    {/* <NewGoalCard {...{ organizationId, standards }} /> */}
  </EntityManagerItem>
);

StandardActivelyManageItem.propTypes = {
  organizationId: PropTypes.string.isRequired,
  standards: PropTypes.array.isRequired,
};

export default StandardActivelyManageItem;
