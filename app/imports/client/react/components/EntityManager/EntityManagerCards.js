import PropTypes from 'prop-types';
import React, { createContext } from 'react';
import { Card } from 'reactstrap';
import { FieldArray } from 'react-final-form-arrays';
import cx from 'classnames';

import { renderComponent } from '../../helpers';

const { Provider, Consumer } = createContext({});

const EntityManagerCards = ({
  containerClassName,
  ...rest
}) => (
  <Card className={cx('new-cards', containerClassName)}>
    <FieldArray name="cards" subscription={{}}>
      {({ fields }) => fields.map((name, index) => (
        <Provider key={name} value={{ field: { name, index }, fields }}>
          {renderComponent({ field: { name, index }, fields, ...rest })}
        </Provider>
      ))}
    </FieldArray>
  </Card>
);

EntityManagerCards.propTypes = {
  component: PropTypes.func,
  containerClassName: PropTypes.string,
  render: PropTypes.func,
};

export { Consumer };

export default EntityManagerCards;
