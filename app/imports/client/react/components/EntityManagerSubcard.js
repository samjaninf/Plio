import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { CardTitle, Card } from 'reactstrap';

import { withToggle } from '../helpers';
import Subcard from './Subcard';
import SubcardHeader from './SubcardHeader';
import SubcardBody from './SubcardBody';
import CardBlock from './CardBlock';
import { Pull } from './Utility';
import {
  EntityManager,
  EntityManagerForms,
  EntityManagerAddButton,
  EntityManagerCards,
  EntityManagerCard,
  EntityManagerForm,
} from './EntityManager';

const enhance = withToggle();
class EntityManagerSubcard extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    title: PropTypes.node,
    newEntityTitle: PropTypes.node.isRequired,
    newEntityButtonTitle: PropTypes.node.isRequired,
    entities: PropTypes.array.isRequired,
    render: PropTypes.func.isRequired,
    renderNewEntity: PropTypes.func.isRequired,
    open: PropTypes.string,
    onSave: PropTypes.func.isRequired,
    initialValues: PropTypes.object,
    header: PropTypes.node,
  }

  renderForm = () => {
    const {
      onSave,
      newEntityTitle,
      renderNewEntity,
      initialValues,
    } = this.props;

    return (
      <EntityManagerForm {...{ initialValues }} onSubmit={onSave}>
        {props => (
          <EntityManagerCard label={newEntityTitle}>
            {renderNewEntity(props)}
          </EntityManagerCard>
        )}
      </EntityManagerForm>
    );
  }

  render() {
    const {
      header,
      title,
      isOpen,
      toggle,
      entities,
      render,
      newEntityTitle,
      newEntityButtonTitle,
      onSave,
      open,
    } = this.props;

    return (
      <Subcard {...{ isOpen, toggle }}>
        <SubcardHeader>
          {header || (
            <Fragment>
              <Pull left>
                <CardTitle>{title}</CardTitle>
              </Pull>
              <Pull right>
                <CardTitle>
                  {entities.length || ''}
                </CardTitle>
              </Pull>
            </Fragment>
          )}
        </SubcardHeader>
        <SubcardBody>
          <CardBlock>
            <EntityManager active={open}>
              {({ active, toggle: toggleEntity }) => (
                <Fragment>
                  {!!entities.length && (
                    <Card>
                      {entities.map(entity => render({
                        entity,
                        isOpen: active === entity._id,
                        toggle: obj => toggleEntity(obj.entity._id),
                      }))}
                    </Card>
                  )}
                  <EntityManagerForms>
                    <EntityManagerCards
                      onSubmit={onSave}
                      label={newEntityTitle}
                      render={this.renderForm}
                    />
                    <EntityManagerAddButton>{newEntityButtonTitle}</EntityManagerAddButton>
                  </EntityManagerForms>
                </Fragment>
              )}
            </EntityManager>
          </CardBlock>
        </SubcardBody>
      </Subcard>
    );
  }
}

export default enhance(EntityManagerSubcard);
