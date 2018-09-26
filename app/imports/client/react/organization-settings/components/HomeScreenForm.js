import React from 'react';
import PropTypes from 'prop-types';
import diff from 'deep-diff';
import { Form } from 'react-final-form';
import { noop, lenses } from 'plio-util';
import { Mutation } from 'react-apollo';
import { over, compose, pick } from 'ramda';

import { swal } from '../../../util';
import { Mutation as Mutations } from '../../../graphql';
import { HomeScreenTypes, HomeScreenLabels } from '../../../../share/constants';
import {
  SelectInputField,
  FormField,
} from '../../components';

const homeScreenOptions = [
  {
    value: HomeScreenTypes.OPERATIONS,
    label: HomeScreenLabels[HomeScreenTypes.OPERATIONS],
  },
  {
    value: HomeScreenTypes.CANVAS,
    label: HomeScreenLabels[HomeScreenTypes.CANVAS],
  },
];

const getHomeScreenOption = (value = HomeScreenTypes.OPERATIONS) => ({
  value,
  label: HomeScreenLabels[value],
});

const getInitialValues = compose(
  over(lenses.homeScreenType, getHomeScreenOption),
  pick(['homeScreenType']),
);

const HomeScreenForm = ({ organization }) => (
  <Mutation mutation={Mutations.UPDATE_ORGANIZATION}>
    {updateOrganization => (
      <Form
        subscription={{}}
        initialValues={getInitialValues(organization)}
        onSubmit={(values) => {
          const currentValues = getInitialValues(organization);
          const isDirty = diff(values, currentValues);

          if (!isDirty) return undefined;

          const { homeScreenType } = values;

          return updateOrganization({
            variables: {
              input: {
                _id: organization._id,
                homeScreenType: homeScreenType.value,
              },
            },
          }).then(noop).catch(swal.error);
        }}
      >
        {({ handleSubmit }) => (
          <FormField>
            Default home screen
            <SelectInputField
              name="homeScreenType"
              options={homeScreenOptions}
              onChange={handleSubmit}
            />
          </FormField>
        )}
      </Form>
    )}
  </Mutation>
);

HomeScreenForm.propTypes = {
  organization: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    homeScreenType: PropTypes.string,
  }).isRequired,
};

export default HomeScreenForm;
