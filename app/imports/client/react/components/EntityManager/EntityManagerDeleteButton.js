import React from 'react';

import { Consumer } from './EntityManagerCards';
import EntityDeleteButton from './EntityDeleteButton';

const EntityManagerDeleteButton = props => (
  <Consumer>
    {({ field: { index }, fields }) => (
      <EntityDeleteButton
        {...props}
        onClick={() => fields.remove(index)}
      />
    )}
  </Consumer>
);

export default EntityManagerDeleteButton;
