import PropTypes from 'prop-types';
import React from 'react';
import { indexBy } from 'ramda';
import { getId } from 'plio-util';
import {
  Row,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
} from 'reactstrap';
import styled from 'styled-components';

import { EntityLabel, Icon, IconLoading, Col } from '../../components';
import { WithToggle, WithState } from '../../helpers';
import { swal } from '../../../util';

const StyledRow = styled(Row)`
  margin-bottom: 15px;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  word-break: break-word;

  .dropdown {
    & > button {
      padding: inherit;
    }

    .dropdown-menu {
      max-height: 200px;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
`;

const IconContainer = styled.span`
  cursor: pointer;
`;

const Matcher = ({
  matchedItems,
  suggestedItems,
  _id,
  title,
  sequentialId,
  documentType,
  onMatch,
  onUnmatch,
  noSuggestedItemsText,
  hasMatchedDocument,
  noMatchedDocumentText,
}) => {
  const hasMatchedItems = !!matchedItems.length;
  const indexedMatchedItems = indexBy(getId, matchedItems);
  const suggestions = suggestedItems.filter(item => !indexedMatchedItems[item._id]);

  return (
    <StyledRow>
      <Col xs="6">
        <Wrapper>
          <EntityLabel {...{ title, sequentialId }} />
          <WithToggle>
            {({ isOpen, toggle }) => (
              <Dropdown {...{ isOpen, toggle }}>
                <DropdownToggle color="link">
                  <Icon
                    name="arrows-h"
                    size="3"
                    color={hasMatchedItems ? 'success' : undefined}
                  />
                </DropdownToggle>
                <DropdownMenu>
                  {!hasMatchedDocument && (
                    <DropdownItem disabled>
                      {noMatchedDocumentText}
                    </DropdownItem>
                  )}
                  {hasMatchedDocument && !suggestions.length && (
                    <DropdownItem disabled>
                      {noSuggestedItemsText}
                    </DropdownItem>
                  )}
                  {suggestions.map(suggestedItem => (
                    <DropdownItem
                      key={suggestedItem._id}
                      onClick={() => onMatch({
                        variables: {
                          input: {
                            rel1: {
                              documentType,
                              documentId: _id,
                            },
                            rel2: {
                              documentType: suggestedItem.documentType,
                              documentId: suggestedItem._id,
                            },
                          },
                        },
                      }).catch(swal.error)}
                    >
                      <EntityLabel
                        title={suggestedItem.title}
                        sequentialId={suggestedItem.sequentialId}
                      />
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            )}
          </WithToggle>
        </Wrapper>
      </Col>
      <Col xs="6">
        {matchedItems.map(matchedItem => (
          <EntityLabel
            key={matchedItem._id}
            title={matchedItem.title}
            sequentialId={matchedItem.sequentialId}
          >
            {' '}
            <WithState initialState={{ loading: false }}>
              {({ state: { loading }, setState }) => (
                <IconContainer
                  onClick={() => {
                    if (loading) return;

                    setState({ loading: true });

                    onUnmatch({
                      awaitRefetchQueries: true,
                      variables: {
                        input: {
                          rel1: {
                            documentType,
                            documentId: _id,
                          },
                          rel2: {
                            documentId: matchedItem._id,
                            documentType: matchedItem.documentType,
                          },
                        },
                      },
                    }).catch((err) => {
                      setState({ loading: false });
                      swal.error(err);
                    });
                  }}
                >
                  {loading ? <IconLoading /> : <Icon name="times-circle" size="2" />}
                </IconContainer>
              )}
            </WithState>
          </EntityLabel>
        ))}
      </Col>
    </StyledRow>
  );
};

Matcher.propTypes = {
  matchedItems: PropTypes.arrayOf(PropTypes.object),
  suggestedItems: PropTypes.arrayOf(PropTypes.object),
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  sequentialId: PropTypes.string.isRequired,
  documentType: PropTypes.string.isRequired,
  onMatch: PropTypes.func.isRequired,
  onUnmatch: PropTypes.func.isRequired,
  noSuggestedItemsText: PropTypes.string.isRequired,
  noMatchedDocumentText: PropTypes.string.isRequired,
  hasMatchedDocument: PropTypes.bool,
};

export default Matcher;
