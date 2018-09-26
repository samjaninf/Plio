import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Row } from 'reactstrap';
import { bySequentialId, noop } from 'plio-util';
import { Mutation } from 'react-apollo';
import { ifElse, isNil, always, converge, concat, propOr, compose, sort } from 'ramda';

import { Composer } from '../../helpers';
import { Mutation as Mutations, Query as Queries } from '../../../graphql';
import Matcher from './Matcher';
import { Col } from '../../components';

const getRefetchQueries = _id => [{
  query: Queries.VALUE_PROPOSITION_CARD,
  variables: { _id },
}];

const getSuggestedItems = ifElse(
  isNil,
  always([]),
  compose(
    sort(bySequentialId),
    converge(concat, [
      propOr([], 'needs'),
      propOr([], 'wants'),
    ]),
  ),
);

const ValueComponentsMatcher = ({
  benefits,
  features,
  documentId,
  matchedTo,
}) => (
  <Composer
    components={[
      /* eslint-disable react/no-children-prop */
      <Mutation
        mutation={Mutations.CREATE_RELATION}
        refetchQueries={getRefetchQueries(documentId)}
        children={noop}
      />,
      <Mutation
        mutation={Mutations.DELETE_RELATION}
        refetchQueries={getRefetchQueries(documentId)}
        children={noop}
      />,
      /* eslint-enable react/no-children-prop */
    ]}
  >
    {([createRelation, deleteRelation]) => (
      <Fragment>
        <Row>
          <Col xs="6">
            <legend>Features & benefits</legend>
          </Col>
          <Col xs="6">
            <legend>Needs & wants</legend>
          </Col>
        </Row>
        {benefits.concat(features).sort(bySequentialId).map(({
          _id,
          sequentialId,
          title,
          needs,
          wants,
          documentType,
        }) => (
          <Matcher
            {...{
              _id,
              sequentialId,
              title,
              documentType,
            }}
            key={_id}
            matchedItems={needs.concat(wants).sort(bySequentialId)}
            suggestedItems={getSuggestedItems(matchedTo)}
            onMatch={createRelation}
            onUnmatch={deleteRelation}
            hasMatchedDocument={!!matchedTo}
            /* eslint-disable max-len */
            noSuggestedItemsText="No Needs or Wants found. Please add some to the Customer segment"
            noMatchedDocumentText="No Customer segment found. Please add one, with some Needs and Wants"
            /* eslint-enable max-len */
          />
        ))}
      </Fragment>
    )}
  </Composer>
);

ValueComponentsMatcher.propTypes = {
  benefits: PropTypes.arrayOf(PropTypes.object).isRequired,
  features: PropTypes.arrayOf(PropTypes.object).isRequired,
  documentId: PropTypes.string.isRequired,
  matchedTo: PropTypes.shape({
    needs: PropTypes.arrayOf(PropTypes.object),
    wants: PropTypes.arrayOf(PropTypes.object),
  }),
};

export default ValueComponentsMatcher;
