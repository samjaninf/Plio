import React from 'react';
import { CardSubtitle } from 'reactstrap';
import styled from 'styled-components';

const StyledCardSubtitle = styled(CardSubtitle)`
  margin-top: 5px;
  line-height: 1.5;
`;

const SubcardSubtitle = props => (
  <StyledCardSubtitle {...props} className="text-muted" />
);

export default SubcardSubtitle;
