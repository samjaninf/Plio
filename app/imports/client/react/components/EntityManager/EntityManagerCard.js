import React from 'react';

import EntityManagerDeleteButton from './EntityManagerDeleteButton';
import EntityCard from './EntityCard';

const EntityManagerCard = props => (
  <EntityCard
    disabled
    renderLeftButton={EntityManagerDeleteButton}
    {...props}
  />
);

export default EntityManagerCard;
