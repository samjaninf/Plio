import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import pluralize from 'pluralize';
import { ButtonGroup, DropdownItem } from 'reactstrap';
import { Query, Mutation } from 'react-apollo';
import { sortByIds } from 'plio-util';
import { pathOr } from 'ramda';

import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { ApolloFetchPolicies, GraphQLTypenames } from '../../../../api/constants';
import { WithToggle } from '../../helpers';
import CanvasSection from './CanvasSection';
import CanvasSectionHeading from './CanvasSectionHeading';
import CanvasAddButton from './CanvasAddButton';
import CanvasSectionFooter from './CanvasSectionFooter';
import CanvasSectionFooterLabels from './CanvasSectionFooterLabels';
import CanvasLabel from './CanvasLabel';
import CanvasChartButton from './CanvasChartButton';
import CanvasSectionHelp from './CanvasSectionHelp';
import CanvasSectionItems from './CanvasSectionItems';
import CanvasSectionItem from './CanvasSectionItem';
import CanvasSquareIcon from './CanvasSquareIcon';

const CanvasBlock = ({
  label,
  help,
  items,
  renderModal,
  renderEditModal,
  goals,
  standards,
  risks,
  nonConformities,
  organizationId,
  sectionName,
}) => {
  const isEmpty = !items.length;

  return (
    <WithToggle>
      {({ isOpen, toggle }) => (
        <CanvasSection
          onClick={isEmpty ? toggle : undefined}
          empty={isEmpty}
        >
          <CanvasSectionHeading>
            <h4>{label}</h4>
            {renderModal({ isOpen, toggle })}
            <CanvasAddButton onClick={isEmpty ? undefined : toggle} />
          </CanvasSectionHeading>
          {isEmpty && (
            <CanvasSectionHelp>
              {help}
            </CanvasSectionHelp>
          )}
          <Query
            query={Queries.CANVAS_SETTINGS}
            variables={{ organizationId, sectionName }}
            fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
          >
            {({ data: { canvasSettings: { canvasSettings = {} } } }) => (
              <Mutation mutation={Mutations.REORDER_CANVAS_ITEMS}>
                {reorderCanvasItems => (
                  <CanvasSectionItems
                    onChange={order => (
                      reorderCanvasItems({
                        variables: {
                          input: {
                            organizationId,
                            sectionName,
                            order,
                          },
                        },
                        optimisticResponse: {
                          __typename: GraphQLTypenames.MUTATION,
                          reorderCanvasItems: {
                            __typename: GraphQLTypenames.CANVAS_SETTINGS,
                            ...canvasSettings,
                            [sectionName]: {
                              __typename: GraphQLTypenames.CANVAS_SECTION_SETTINGS,
                              order,
                            },
                          },
                        },
                      })
                    )}
                  >
                    {items && sortByIds(
                      pathOr([], [sectionName, 'order'], canvasSettings),
                      items,
                    ).map(item => (
                      <WithToggle key={item._id}>
                        {itemToggleState => (
                          <Fragment>
                            {renderEditModal && renderEditModal({ ...itemToggleState, item })}
                            <CanvasSectionItem onClick={itemToggleState.toggle} data-id={item._id}>
                              <CanvasSquareIcon color={item.color} />
                              <span>{item.title}</span>
                            </CanvasSectionItem>
                          </Fragment>
                        )}
                      </WithToggle>
                    ))}
                  </CanvasSectionItems>
                )}
              </Mutation>
            )}
          </Query>
          <CanvasSectionFooter>
            <CanvasSectionFooterLabels>
              <ButtonGroup>
                {!!goals.length && (
                  <CanvasLabel label={pluralize('key goal', goals.length, true)}>
                    {goals.map(({ sequentialId, title }) => (
                      <DropdownItem key={sequentialId}>
                        <span className="text-muted">{sequentialId}</span>
                        {' '}
                        <span>{title}</span>
                      </DropdownItem>
                    ))}
                  </CanvasLabel>
                )}
                {!!standards.length && (
                  <CanvasLabel label={pluralize('standard', standards.length, true)}>
                    {standards.map(({ issueNumber, title }) => (
                      <DropdownItem key={issueNumber}>
                        <span>{title}</span>
                        {' '}
                        <span className="text-muted">{issueNumber}</span>
                      </DropdownItem>
                    ))}
                  </CanvasLabel>
                )}
                {!!risks.length && (
                  <CanvasLabel label={pluralize('risk', risks.length, true)}>
                    {risks.map(({ sequentialId, title }) => (
                      <DropdownItem key={sequentialId}>
                        <span className="text-muted">{sequentialId}</span>
                        {' '}
                        <span>{title}</span>
                      </DropdownItem>
                    ))}
                  </CanvasLabel>
                )}
                {!!nonConformities.length && (
                  <CanvasLabel label={pluralize('NCs & gain', nonConformities.length, true)}>
                    {standards.map(({ sequentialId, title }) => (
                      <DropdownItem key={sequentialId}>
                        <span className="text-muted">{sequentialId}</span>
                        {' '}
                        <span>{title}</span>
                      </DropdownItem>
                    ))}
                  </CanvasLabel>
                )}
              </ButtonGroup>
            </CanvasSectionFooterLabels>
            {/* TODO: render icon dynamically
            there should be a modal for chart too */}
            <CanvasChartButton icon="th-large" />
          </CanvasSectionFooter>
        </CanvasSection>
      )}
    </WithToggle>
  );
};

CanvasBlock.defaultProps = {
  goals: [],
  standards: [],
  risks: [],
  nonConformities: [],
};

CanvasBlock.propTypes = {
  organizationId: PropTypes.string.isRequired,
  sectionName: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  help: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  })).isRequired,
  renderModal: PropTypes.func.isRequired,
  renderEditModal: PropTypes.func.isRequired,
  goals: PropTypes.arrayOf(PropTypes.shape({
    sequentialId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })),
  standards: PropTypes.arrayOf(PropTypes.shape({
    issueNumber: PropTypes.string,
    title: PropTypes.string.isRequired,
  })),
  risks: PropTypes.arrayOf(PropTypes.shape({
    sequentialId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })),
  nonConformities: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    sequentialId: PropTypes.string.isRequired,
  })),
};

export default CanvasBlock;
