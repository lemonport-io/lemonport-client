import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import BaseLayout from '../layout/base';

const StyledWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  text-transform: uppercase;
  text-align: center;
`;

const NotFound = () => (
  <BaseLayout>
    <StyledWrapper>
      <Link to="/">
        <h3>404 Page Not Found</h3>
      </Link>
    </StyledWrapper>
  </BaseLayout>
);
export default NotFound;
