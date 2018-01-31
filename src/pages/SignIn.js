import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Input from '../components/Input';
import InputTwoFactor from '../components/InputTwoFactor';
import Button from '../components/Button';
import Form from '../components/Form';
import BaseLayout from '../layout/base';
import {
  authSignIn,
  authSignInTwoFactor,
  authUpdateEmail,
  authUpdatePassword,
  authUpdateCode,
  authClearFields
} from '../reducers/_auth';

const StyledForm = styled(Form)`
  padding: 20px;
`;

class SignIn extends Component {
  onSubmit = e => {
    e.preventDefault();
    if (this.props.requireTwoFactor) {
      this.props.authSignInTwoFactor(this.props.email, this.props.password, this.props.code);
    } else {
      this.props.authSignIn(this.props.email, this.props.password);
    }
  };
  componentWillUnmount() {
    this.props.authClearFields();
  }
  render() {
    return (
      <BaseLayout fetching={this.props.fetching}>
        {!this.props.requireTwoFactor ? (
          <StyledForm onSubmit={this.onSubmit}>
            <h4>Sign In to your account</h4>
            <Input
              placeholder="Email"
              type="email"
              value={this.props.email}
              onChange={({ target }) => this.props.authUpdateEmail(target.value)}
            />

            <Input
              placeholder="Password"
              type="password"
              value={this.props.password}
              onChange={({ target }) => this.props.authUpdatePassword(target.value)}
            />
            <Button type="submit">Sign In</Button>
          </StyledForm>
        ) : (
          <StyledForm onSubmit={this.onSubmit}>
            <h4>Two Factor authentication</h4>

            <InputTwoFactor
              placeholder="6 Digit Code"
              type="text"
              value={this.props.code}
              onChange={code => this.props.authUpdateCode(code)}
            />
            <Button type="submit">Sign In</Button>
          </StyledForm>
        )}
      </BaseLayout>
    );
  }
}

SignIn.propTypes = {
  authSignIn: PropTypes.func.isRequired,
  authSignInTwoFactor: PropTypes.func.isRequired,
  authUpdateEmail: PropTypes.func.isRequired,
  authUpdatePassword: PropTypes.func.isRequired,
  authUpdateCode: PropTypes.func.isRequired,
  authClearFields: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  fetchingTwoFactor: PropTypes.bool.isRequired,
  requireTwoFactor: PropTypes.bool.isRequired
};

const reduxProps = ({ auth }) => ({
  fetching: auth.fetching,
  email: auth.email,
  password: auth.password,
  code: auth.code,
  fetchingTwoFactor: auth.fetchingTwoFactor,
  requireTwoFactor: auth.requireTwoFactor
});

export default connect(reduxProps, {
  authSignIn,
  authSignInTwoFactor,
  authUpdateEmail,
  authUpdatePassword,
  authUpdateCode,
  authClearFields
})(SignIn);
