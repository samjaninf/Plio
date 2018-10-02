import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ListGroupItem, Form } from 'reactstrap';

import {
  Icon,
  EntityForm,
  EntityCard,
} from '../../../components';

const ActivelyManageItem = ({
  isOpen,
  toggle,
  label,
  children,
  initialValues,
  onSubmit,
}) => (
  <Fragment>
    <ListGroupItem tag="a" onClick={toggle}>
      Add a <strong>{label}</strong>
      <Icon name="question-circle" />
    </ListGroupItem>
    <EntityForm {...{ initialValues, onSubmit }}>
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <EntityCard {...{ isOpen }} onDelete={toggle}>
            {children}
          </EntityCard>
        </Form>
      )}
    </EntityForm>
  </Fragment>
);

ActivelyManageItem.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
};

export default ActivelyManageItem;
