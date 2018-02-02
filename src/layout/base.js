import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from '../components/Link';
import Loader from '../components/Loader';
import Column from '../components/Column';
import PopUp from '../components/PopUp';
import Button from '../components/Button';
import lemonportWhite from '../assets/lemonport-white.svg';
import { getSession } from '../helpers/utilities';
import { responsive } from '../styles';

const StyledBaseLayout = styled.div`
  width: 100vw;
  padding: 120px 10px;
  text-align: center;
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

const StyledLogoWrapper = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledButton = styled(Button)`
  margin-top: 20px;
`;

class BaseLayout extends Component {
  state = {
    openPopUp: false
  };
  togglePopUp = () => this.setState({ openPopUp: !this.state.openPopUp });
  render() {
    const isDashboard = window.browserHistory
      ? window.browserHistory.location.pathname === '/dashboard'
      : false;
    return (
      <StyledBaseLayout>
        <Column>
          <StyledHeader>
            {isDashboard ? (
              <StyledLogoWrapper>
                <StyledLogo src={lemonportWhite} alt="logo" onClick={this.togglePopUp} />
                <PopUp show={this.state.openPopUp}>
                  <p>{getSession().email}</p>
                  <Link to="/signout">
                    <StyledButton dark>Sign Out</StyledButton>
                  </Link>
                </PopUp>
              </StyledLogoWrapper>
            ) : (
              <Link to="/">
                <StyledLogo src={lemonportWhite} alt="logo" />
              </Link>
            )}
          </StyledHeader>
          <StyledContent fetching={this.props.fetching}>
            {this.props.fetching ? <Loader /> : this.props.children}
          </StyledContent>
        </Column>
      </StyledBaseLayout>
    );
  }
}

BaseLayout.propTypes = {
  fetching: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
};

BaseLayout.defaultProps = {
  fetching: false
};

export default BaseLayout;
