import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ListGroupItem, Form } from 'reactstrap';
import { identity } from 'ramda';

import {
  Icon,
  EntityForm,
  EntityCard,
} from '../../../components';

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
  onSubmit,
}) => (
  <Fragment>
    <ListGroupItem tag="a" onClick={toggle}>
      Add a <strong>{label}</strong>
      <Icon name="question-circle" />
    </ListGroupItem>
    <BodyWrapper>
      <EntityForm
        {...{ initialValues }}
        onSubmit={values => onSubmit(values).then(toggle).catch(identity)}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <EntityCard {...{ isOpen }} onDelete={toggle}>
              {children}
            </EntityCard>
          </Form>
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
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
};

export default ActivelyManageItem;