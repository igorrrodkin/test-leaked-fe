import React from 'react';
import styled from 'styled-components';

const EmptyServices = () => (
  <StyledEmptyServices>
    Please reach out to our support team and they will check
    information about available services for your organisation.
  </StyledEmptyServices>
);

const StyledEmptyServices = styled.p`
  font-size: 14px;
  text-align: center;
  color: #00000080;
`;

export default EmptyServices;
