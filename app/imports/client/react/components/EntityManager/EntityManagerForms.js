import PropTypes from 'prop-types';
import React, { createContext } from 'react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { noop } from 'plio-util';

const { Provider, Consumer } = createContext({});

const EntityManagerForms = ({ children }) => (
  <Form
    onSubmit={noop}
    subscription={{}}
    mutators={arrayMutators}
  >
    {({ form: { mutators } }) => (
      <Provider value={{ mutators }}>
        {children}
      </Provider>
    )}
  </Form>
);

EntityManagerForms.propTypes = {
  children: PropTypes.node.isRequired,
};

export { Consumer };

export default EntityManagerForms;
