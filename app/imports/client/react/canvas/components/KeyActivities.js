import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { ButtonGroup } from 'reactstrap';

import CanvasSection from './CanvasSection';
import CanvasSectionHeading from './CanvasSectionHeading';
import CanvasAddButton from './CanvasAddButton';
import CanvasSectionItems from './CanvasSectionItems';
import CanvasSectionItem from './CanvasSectionItem';
import CanvasSquareIcon from './CanvasSquareIcon';
import CanvasSectionFooter from './CanvasSectionFooter';
import CanvasSectionFooterLabels from './CanvasSectionFooterLabels';
import CanvasLabel from './CanvasLabel';
// import CanvasSectionHelp from './CanvasSectionHelp';
import KeyActivityAddModal from './KeyActivityAddModal';
import { WithToggle } from '../../helpers';

const items = [
  { sequentialId: 'KG1', title: 'Finish ui design' },
  { sequentialId: 'KG3', title: 'Close New York Office' },
  { sequentialId: 'RK2', title: 'Strike or stoppage' },
  { sequentialId: 'NC3', title: 'Brackets getting corroded' },
];

const KeyActivities = ({ organizationId }) => (
  <CanvasSection>
    <CanvasSectionHeading>
      <h4>Key Activities</h4>
      <WithToggle>
        {({ isOpen, toggle }) => (
          <Fragment>
            <KeyActivityAddModal {...{ isOpen, toggle, organizationId }} />
            <CanvasAddButton onClick={toggle} />
          </Fragment>
        )}
      </WithToggle>
    </CanvasSectionHeading>
    {/* <CanvasSectionHelp>
      <p>What are the key activities we need to create our value propositions?</p>
    </CanvasSectionHelp> */}
    <CanvasSectionItems>
      <CanvasSectionItem>
        <CanvasSquareIcon pink />
        <span>mtDNA profiling (per disease)</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon yellow />
        <span>In vivo validation</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon yellow />
        <span>Promotion to influencers & investors</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon magenta />
        <span>In vitro target characterisation</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon yellow />
        <span>Patent filling</span>
      </CanvasSectionItem>
    </CanvasSectionItems>
    <CanvasSectionFooter>
      <CanvasSectionFooterLabels>
        <ButtonGroup>
          {items.map(({ sequentialId, title }) => (
            <CanvasLabel key={sequentialId} label={sequentialId} tooltip={title} />
          ))}
        </ButtonGroup>
      </CanvasSectionFooterLabels>
    </CanvasSectionFooter>
  </CanvasSection>
);

KeyActivities.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default KeyActivities;