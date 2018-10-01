import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'reactstrap';

import TextAlign from '../Utility/TextAlign';

import { Consumer } from './EntityManagerForms';

const EntityManagerButton = ({ children, ...props }) => (
  <Consumer>
    {({ mutators: { push } }) => (
      <TextAlign center>
        <div>
          <Button color="link" onClick={() => push('cards', undefined)} {...props}>
            {children}
          </Button>
        </div>
      </TextAlign>
    )}
  </Consumer>
);

EntityManagerButton.propTypes = {
  children: PropTypes.node,
};

export default EntityManagerButton;
