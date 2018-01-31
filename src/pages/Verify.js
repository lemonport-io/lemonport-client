import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import BaseLayout from '../layout/base';
import Link from '../components/Link';
import Button from '../components/Button';
import Reload from '../components/Reload';
import { userEmailVerify, userClearState } from '../reducers/_user';

const StyledFlex = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const StyledTitle = styled.h4`
  margin-top: 40px;
`;

const StyledButton = styled(Button)`
  margin: 25px;
`;

class Verify extends Component {
  componentWillMount() {
    this.verifyEmail();
  }
  verifyEmail = () => {
    const hash = window.browserHistory.location.pathname.replace('/verify/', '');
    this.props.userEmailVerify(hash);
  };
  componentWillUnmount() {
    this.props.userClearState();
  }
  render = () => (
    <BaseLayout fetching={this.props.fetching}>
      {this.props.verified ? (
        <StyledFlex>
          <StyledTitle>Your email is now verified</StyledTitle>
          <Link to="/signin">
            <StyledButton>Sign In</StyledButton>
          </Link>
        </StyledFlex>
      ) : (
        <StyledFlex>
          <StyledTitle>Try Again</StyledTitle>
          <Reload onClick={this.verifyEmail} />
        </StyledFlex>
      )}
    </BaseLayout>
  );
}

Verify.propTypes = {
  userEmailVerify: PropTypes.func.isRequired,
  userClearState: PropTypes.func.isRequired
};

const reduxProps = ({ user }) => ({
  fetching: user.fetching,
  verified: user.verified
});

export default connect(reduxProps, { userEmailVerify, userClearState })(Verify);
