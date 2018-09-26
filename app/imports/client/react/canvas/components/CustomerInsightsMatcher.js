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
  query: Queries.CUSTOMER_SEGMENT_CARD,
  variables: { _id },
}];

const getSuggestedItems = ifElse(
  isNil,
  always([]),
  compose(
    sort(bySequentialId),
    converge(concat, [
      propOr([], 'benefits'),
      propOr([], 'features'),
    ]),
  ),
);

const CustomerInsightsMatcher = ({
  needs,
  wants,
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
            <legend>Needs & wants</legend>
          </Col>
          <Col xs="6">
            <legend>Features & benefits</legend>
          </Col>
        </Row>
        {needs.concat(wants).sort(bySequentialId).map(({
          _id,
          sequentialId,
          title,
          benefits,
          features,
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
            matchedItems={benefits.concat(features).sort(bySequentialId)}
            suggestedItems={getSuggestedItems(matchedTo)}
            onMatch={createRelation}
            onUnmatch={deleteRelation}
            hasMatchedDocument={!!matchedTo}
            /* eslint-disable max-len */
            noSuggestedItemsText="No Features or Benefits found. Please add some to the Value proposition"
            noMatchedDocumentText="No Value proposition found. Please add one, with some Features and Benefits"
            /* eslint-enable max-len */
          />
        ))}
      </Fragment>
    )}
  </Composer>
);

CustomerInsightsMatcher.propTypes = {
  needs: PropTypes.arrayOf(PropTypes.object).isRequired,
  wants: PropTypes.arrayOf(PropTypes.object).isRequired,
  documentId: PropTypes.string.isRequired,
  matchedTo: PropTypes.shape({
    benefits: PropTypes.arrayOf(PropTypes.object),
    features: PropTypes.arrayOf(PropTypes.object),
  }),
};

export default CustomerInsightsMatcher;
