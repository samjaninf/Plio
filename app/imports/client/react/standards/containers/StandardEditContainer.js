import PropTypes from 'prop-types';
import React from 'react';
import { pure } from 'recompose';
import {
  pick,
  compose,
  over,
  pluck,
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

import { Composer, WithState, renderComponent } from '../../helpers';
import { Mutation as Mutations } from '../../../graphql';

const getInitialValues = compose(
  over(lenses.owner, getUserOptions),
  over(lenses.section, getEntityOptions),
  over(lenses.departments, mapEntitiesToOptions),
  pick([
    'title',
    'owner',
    'status',
    'section',
    'typeId',
    'source1',
    'description',
    'issueNumber',
    'departments',
  ]),
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
              source1: { fileId, type, url },
              section: { value: sectionId } = {},
              owner: { value: owner } = {},
              departments,
            } = values;

            return updateStandard({
              variables: {
                input: {
                  _id: standard._id,
                  source1: { fileId, type, url },
                  departmentsIds: pluck('value', departments),
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

export default pure(StandardEditContainer);
