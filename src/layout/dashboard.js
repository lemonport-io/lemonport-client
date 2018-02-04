import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Link from '../components/Link';
import Loader from '../components/Loader';
// import Warning from '../components/Warning';
import Notification from '../components/Notification';
import lemonportLogo from '../assets/lemonport-logo.svg';
import profilePlaceholder from '../assets/profile-placeholder.png';
import { initFB, fetchFB } from '../helpers/facebook';
import { getSession, updateSession, formatCurrencyString } from '../helpers/utilities';
import { colors, shadows, responsive, transitions } from '../styles';

const StyledBaseLayout = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 0;
  z-index: 0;
  text-align: center;
  color: rgb(${colors.dark});
  background: rgb(${colors.white});
`;

const StyledHeader = styled.div`
  width: 100%;
  z-index: 2;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: space-between;
  background: rgb(${colors.white});
  box-shadow: ${shadows.soft} rgba(${colors.dark}, 0.1);
  padding: 15px 50px;
  @media screen and (${responsive.md.max}) {
    padding: 15px 25px;
  }
  @media screen and (${responsive.sm.max}) {
    padding: 15px 15px;
  }
`;

const StyledTotalBalance = styled.div`
  z-index: 1;
  opacity: 0.7;
  font-weight: 300px;
  font-size: 20px;
`;

const StyledLogo = styled.div`
  position: absolute;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  & img {
    width: 100%;
    max-width: 165px;
  }
`;

const StyledProfile = styled.div`
  display: flex;
  z-index: 1;
  justify-content: center;
  align-items: center;
  & img {
    border-radius: 50%;
    width: 35px;
    height: 35px;
    margin-left: 15px;
  }
  & p {
    opacity: 0.7;
  }
  @media screen and (${responsive.sm.max}) {
    & p {
      display: none;
    }
  }
`;

const StyledMenu = styled.div`
  background: rgb(${colors.white});
  position: fixed;
  z-index: 1;
  top: 65px;
  width: 175px;
  right: 36px;
  transition: ${transitions.base};
  opacity: ${({ show }) => (show ? 1 : 0)};
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
  pointer-events: ${({ show }) => (show ? 'auto' : 'none')};
  & p {
    margin: 0;
    padding: 15px;
    opacity: 0.7;
    border-top: 1px solid rgb(${colors.lightGrey});
  }
  @media screen and (${responsive.md.max}) {
    right: 11px;
  }
  @media screen and (${responsive.sm.max}) {
    right: 0;
    left: 0;
    width: 100vw;
    & p {
      padding: 20px;
    }
  }
`;

const StyledContent = styled.div`
  width: 100%;
  height: calc(100% - 65px);
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: ${({ fetching }) => (fetching ? 'center' : 'flex-start')};
  min-height: ${({ fetching }) => (fetching ? '250px' : 0)};
  background: rgb(${colors.dashboard});
  padding: 15px 50px;
  @media screen and (${responsive.md.max}) {
    padding: 15px 25px;
  }
  @media screen and (${responsive.sm.max}) {
    padding: 15px 15px;
  }
`;

class DashboardLayout extends Component {
  state = {
    showMenu: false,
    profileImage: getSession().profileImage || ''
  };
  componentWillMount() {
    if (getSession().facebookID && !getSession().profileImage) {
      initFB().then(() =>
        fetchFB(`/${getSession().facebookID}/picture?type=large`).then(({ data }) => {
          updateSession({
            profileImage: data.url
          });
          this.setState({ profileImage: data.url });
        })
      );
    }
  }
  render = () => (
    <StyledBaseLayout>
      <StyledHeader>
        <StyledTotalBalance>
          <p>{formatCurrencyString(this.props.totalBalance, this.props.nativeCurrency)}</p>
        </StyledTotalBalance>
        <StyledLogo>
          <Link to="/overview">
            <img src={lemonportLogo} alt="logo" />
          </Link>
        </StyledLogo>
        <StyledProfile onClick={() => this.setState({ showMenu: !this.state.showMenu })}>
          <p>{`${getSession().firstName} ${getSession().lastName}`}</p>
          <img src={this.state.profileImage || profilePlaceholder} alt="profile" />
        </StyledProfile>
        <StyledMenu show={this.state.showMenu}>
          <Link to="/overview">
            <p>Profile</p>
          </Link>
          <Link to="/overview">
            <p>Settings</p>
          </Link>
          <Link to="/overview">
            <p>About</p>
          </Link>
          <Link to="/signout">
            <p>Sign Out</p>
          </Link>
        </StyledMenu>
      </StyledHeader>
      <StyledContent fetching={this.props.fetching}>
        {/* <Warning /> */}
        {this.props.fetching ? <Loader /> : this.props.children}
        <Notification />
      </StyledContent>
    </StyledBaseLayout>
  );
}

DashboardLayout.propTypes = {
  fetching: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  totalBalance: PropTypes.string.isRequired,
  nativeCurrency: PropTypes.string.isRequired
};

DashboardLayout.defaultProps = {
  fetching: false
};

const reduxProps = ({ overview }) => ({
  totalBalance: overview.totalBalance,
  nativeCurrency: overview.nativeCurrency
});

export default connect(reduxProps, null)(DashboardLayout);
