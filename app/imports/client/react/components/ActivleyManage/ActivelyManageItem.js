import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ListGroupItem } from 'reactstrap';

import {
  Icon,
  EntityForm,
  EntityCard,
} from '../';

const BodyWrapper = styled.div`
  .card-block {
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
  }
  &:last-of-type .card-block {
    border-bottom: 1px solid #ddd;
    border-radius: 0 0 .25rem .25rem;
  }
`;

const ActivelyManageItem = ({
  isOpen,
  toggle,
  label,
  children,
  initialValues,
}) => (
  <Fragment>
    <ListGroupItem tag="a" onClick={toggle}>
      Add a <strong>{label}</strong>
      <Icon name="question-circle" />
    </ListGroupItem>
    <BodyWrapper>
      <EntityForm
        {...{ isOpen, initialValues }}
        onSubmit={console.log}
        onDelete={toggle}
        component={EntityCard}
      >
        {() => (
          <Fragment>
            {children}
          </Fragment>
        )}
      </EntityForm>
    </BodyWrapper>
  </Fragment>
);

ActivelyManageItem.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  initialValues: PropTypes.object,
};

export default ActivelyManageItem;
