import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { pure } from 'recompose';
import {
  pick,
  compose,
  over,
  pluck,
  unless,
  isNil,
} from 'ramda';
import { Mutation } from 'react-apollo';
import {
  getUserOptions,
  getEntityOptions,
  lenses,
  noop,
  mapEntitiesToOptions,
} from 'plio-util';
import diff from 'deep-diff';

import { DocumentTypes } from '../../../../share/constants';
import { composeWithTracker, swal } from '../../../util';
import { Composer, WithState, renderComponent } from '../../helpers';
import { Mutation as Mutations } from '../../../graphql';

const getSourceInitialValue = unless(isNil, pick(['type', 'fileId', 'url']));
const getInitialValues = compose(
  over(lenses.owner, getUserOptions),
  over(lenses.section, getEntityOptions),
  over(lenses.departments, mapEntitiesToOptions),
  over(lenses.source1, getSourceInitialValue),
  over(lenses.source2, getSourceInitialValue),
  pick([
    'title',
    'owner',
    'status',
    'section',
    'typeId',
    'source1',
    'source2',
    'description',
    'issueNumber',
    'departments',
  ]),
);

const enhance = composeWithTracker(
  ({ standard: { _id }, isOpen }, onData) => {
    if (isOpen) {
      Meteor.subscribe(
        'sourceFilesByDocument',
        { _id, documentType: DocumentTypes.STANDARD },
        { onStop: error => error && swal.error(error, 'Files subscription error') },
      );
    }
    onData(null, {});
  },
  { propsToWatch: ['isOpen'] },
);

const StandardEditContainer = ({
  standard: standardDoc,
  organizationId,
  isOpen,
  toggle,
  ...props
}) => (
  <WithState
    initialState={{
      standard: standardDoc || null,
      initialValues: getInitialValues(standardDoc),
    }}
  >
    {({ state: { initialValues, standard }, setState }) => (
      <Composer
        components={[
          /* eslint-disable react/no-children-prop */
          <Mutation
            mutation={Mutations.UPDATE_STANDARD}
            onCompleted={({ updateStandard }) => setState({ standard: updateStandard })}
            children={noop}
          />,
          // TODO add delete mutation
          /* eslint-enable react/no-children-prop */
        ]}
      >
        {([updateStandard]) => renderComponent({
          ...props,
          organizationId,
          isOpen,
          toggle,
          standard,
          initialValues,
          onSubmit: async (values, form) => {
            const currentValues = getInitialValues(standard);
            const difference = diff(values, currentValues);

            if (!difference) return undefined;

            const {
              title,
              status,
              typeId,
              description,
              issueNumber,
              uniqueNumber,
              departments,
              source1,
              source2,
              section: { value: sectionId } = {},
              owner: { value: owner } = {},
            } = values;

            return updateStandard({
              variables: {
                input: {
                  _id: standard._id,
                  departmentsIds: pluck('value', departments),
                  source1,
                  source2,
                  title,
                  status,
                  sectionId,
                  typeId,
                  owner,
                  description,
                  issueNumber,
                  uniqueNumber,
                },
              },
            }).then(noop).catch((err) => {
              form.reset(currentValues);
              throw err;
            });
          },
        })}
      </Composer>
    )}
  </WithState>
);

StandardEditContainer.propTypes = {
  organizationId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  standard: PropTypes.object.isRequired,
};

export default pure(enhance(StandardEditContainer));
