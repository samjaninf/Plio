import PropTypes from 'prop-types';
import React from 'react';

import { renderComponent } from '../../helpers';
import { Consumer } from './EntityManager';

const EntityManagerItem = ({ itemId, ...rest }) => (
  <Consumer>
    {({ state: { active }, toggle }) => renderComponent({
      isOpen: active === itemId,
      toggle: () => toggle(itemId),
      ...rest,
    })}
  </Consumer>
);

EntityManagerItem.propTypes = {
  component: PropTypes.func.isRequired,
  itemId: PropTypes.string.isRequired,
};

export default EntityManagerItem;
