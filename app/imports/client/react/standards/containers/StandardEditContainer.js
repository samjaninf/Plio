import PropTypes from 'prop-types';
import React from 'react';
import { pure } from 'recompose';
import {
  pick,
  compose,
  over,
} from 'ramda';
import { Mutation } from 'react-apollo';
import { getUserOptions, getEntityOptions, lenses, noop } from 'plio-util';
import diff from 'deep-diff';

import { Composer, renderComponent } from '../../helpers';
import { Mutation as Mutations } from '../../../graphql';

const getInitialValues = compose(
  over(lenses.owner, getUserOptions),
  over(lenses.section, getEntityOptions),
  pick([
    'title',
    'owner',
    'status',
    'section',
    'type',
    'source1',
  ]),
);

const StandardEditContainer = ({
  standard,
  organizationId,
  isOpen,
  toggle,
  ...props
}) => (
  <Composer
    components={[
      /* eslint-disable react/no-children-prop */
      <Mutation
        mutation={Mutations.UPDATE_STANDARD}
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
      initialValues: getInitialValues(standard),
      onSubmit: async (values, form) => {
        const currentValues = getInitialValues(standard);
        const difference = diff(values, currentValues);

        if (!difference) return undefined;

        const {
          title,
          status,
          source1,
          section: { value: sectionId } = {},
          owner: { value: owner } = {},
          type: typeId,
        } = values;

        return updateStandard({
          variables: {
            input: {
              _id: standard._id,
              title,
              status,
              source1,
              sectionId,
              typeId,
              owner,
            },
          },
        }).then(noop).catch((err) => {
          form.reset(currentValues);
          throw err;
        });
      },
    })}
  </Composer>
);

StandardEditContainer.propTypes = {
  organizationId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  standard: PropTypes.object.isRequired,
};

export default pure(StandardEditContainer);
