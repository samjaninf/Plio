import PropTypes from 'prop-types';
import React from 'react';

import { renderComponent } from '../../helpers';
import { Consumer } from './EntityManager';

const EntityManagerItem = ({ entity, ...rest }) => (
  <Consumer>
    {({ state: { active }, toggle }) => renderComponent({
      isOpen: active === entity._id,
      toggle: () => toggle(entity._id),
      ...rest,
    })}
  </Consumer>
);

EntityManagerItem.propTypes = {
  entity: PropTypes.object.isRequired,
  component: PropTypes.func.isRequired,
};

export default EntityManagerItem;
