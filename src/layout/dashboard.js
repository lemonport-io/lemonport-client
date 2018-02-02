import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from '../components/Link';
import Loader from '../components/Loader';
import lemonportWhite from '../assets/lemonport-white.svg';
import { colors, responsive } from '../styles';

const StyledBaseLayout = styled.div`
  width: 100vw;
  padding: 120px 10px;
  text-align: center;
  color: rgb(${colors.dark});
  background: rgb(${colors.white});
  @media screen and (${responsive.md.max}) {
    padding: 60px 10px;
  }
`;

const StyledHeader = styled.div`
  width: 100%;
  padding: 25px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledLogo = styled.img`
  width: 100%;
  max-width: 350px;
`;

const StyledContent = styled.div`
  width: 100%;
  display: flex;
  align-items: ${({ fetching }) => (fetching ? 'center' : 'flex-start')};
  min-height: ${({ fetching }) => (fetching ? '250px' : 0)};
`;
const BaseLayout = ({ fetching, children, ...props }) => (
  <StyledBaseLayout {...props}>
    <StyledHeader>
      <Link to="/">
        <StyledLogo src={lemonportWhite} alt="logo" />
      </Link>
    </StyledHeader>
    <StyledContent fetching={fetching}>{fetching ? <Loader /> : children}</StyledContent>
  </StyledBaseLayout>
);

BaseLayout.propTypes = {
  fetching: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
};

BaseLayout.defaultProps = {
  fetching: false
};

export default BaseLayout;
