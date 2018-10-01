import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import diff from 'deep-diff';
import {
  map, pick, compose, append, contains,
  values, mapObjIndexed, unless,
} from 'ramda';
import { Form } from 'react-final-form';

import {
  StandardTitles,
  RiskTitles,
  NonConformitiesTitles,
  WorkInboxTitles,
  HomeScreenTitlesTypes,
  HomeScreenTitlesTypesLabels,
} from '../../../../share/constants';
import { swal } from '../../../util';
import { changeTitle } from '../../../../api/organizations/methods';
import { getWorkspaceTitleOption } from '../helpers';
import { FormField } from '../../components';
import ImplementationViewTitleField from './ImplementationViewTitleField';

const mapTitlesToOptions = (titleType, currentTitle, titles) => compose(
  map(getWorkspaceTitleOption(titleType)),
  unless(contains(currentTitle), append(currentTitle)),
)(titles);

const getInitialValues = compose(
  mapObjIndexed((title, titleType) => getWorkspaceTitleOption(titleType, title)),
  pick(values(HomeScreenTitlesTypes)),
);

const ImplementationViewTitlesForm = ({ organizationId, homeScreenTitles }) => (
  <Form
    subscription={{}}
    initialValues={getInitialValues(homeScreenTitles)}
    onSubmit={(titleValues) => {
      const currentValues = getInitialValues(homeScreenTitles);
      const differences = diff(titleValues, currentValues);

      if (!differences) return undefined;

      const {
        // TODO refactor next line
        // when graphql mutation will be used instead of "changeTitle" meteor method
        [differences[0].path[0]]: { value, label },
      } = titleValues;

      return new Promise((resolve, reject) => {
        changeTitle.call({
          fieldName: `${value}`.replace(/\(.*\)/, ''),
          fieldValue: label,
          organizationId,
        }, (error, result) => {
          if (error) {
            swal.error(error);
            reject(error);
          }
          resolve(result);
        });
      });
    }}
  >
    {({ handleSubmit }) => (
      <Fragment>
        <FormField>
          {HomeScreenTitlesTypesLabels[HomeScreenTitlesTypes.STANDARDS]}
          <ImplementationViewTitleField
            name={HomeScreenTitlesTypes.STANDARDS}
            options={mapTitlesToOptions(
              HomeScreenTitlesTypes.STANDARDS,
              homeScreenTitles[HomeScreenTitlesTypes.STANDARDS],
              StandardTitles,
            )}
            onChange={handleSubmit}
          />
        </FormField>
        <FormField>
          {HomeScreenTitlesTypesLabels[HomeScreenTitlesTypes.RISKS]}
          <ImplementationViewTitleField
            name={HomeScreenTitlesTypes.RISKS}
            options={mapTitlesToOptions(
              HomeScreenTitlesTypes.RISKS,
              homeScreenTitles[HomeScreenTitlesTypes.RISKS],
              RiskTitles,
            )}
            onChange={handleSubmit}
          />
        </FormField>
        <FormField>
          {HomeScreenTitlesTypesLabels[HomeScreenTitlesTypes.NON_CONFORMITIES]}
          <ImplementationViewTitleField
            name={HomeScreenTitlesTypes.NON_CONFORMITIES}
            options={mapTitlesToOptions(
              HomeScreenTitlesTypes.NON_CONFORMITIES,
              homeScreenTitles[HomeScreenTitlesTypes.NON_CONFORMITIES],
              NonConformitiesTitles,
            )}
            onChange={handleSubmit}
          />
        </FormField>
        <FormField>
          {HomeScreenTitlesTypesLabels[HomeScreenTitlesTypes.WORK_INBOX]}
          <ImplementationViewTitleField
            name={HomeScreenTitlesTypes.WORK_INBOX}
            options={mapTitlesToOptions(
              HomeScreenTitlesTypes.WORK_INBOX,
              homeScreenTitles[HomeScreenTitlesTypes.WORK_INBOX],
              WorkInboxTitles,
            )}
            onChange={handleSubmit}
          />
        </FormField>
      </Fragment>
    )}
  </Form>
);

ImplementationViewTitlesForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  homeScreenTitles: PropTypes.shape({
    [HomeScreenTitlesTypes.STANDARDS]: PropTypes.string.isRequired,
    [HomeScreenTitlesTypes.RISKS]: PropTypes.string.isRequired,
    [HomeScreenTitlesTypes.NON_CONFORMITIES]: PropTypes.string.isRequired,
    [HomeScreenTitlesTypes.WORK_INBOX]: PropTypes.string.isRequired,
  }).isRequired,
};

export default ImplementationViewTitlesForm;
