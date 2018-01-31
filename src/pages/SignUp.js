import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Input from '../components/Input';
import Button from '../components/Button';
import Form from '../components/Form';
import BaseLayout from '../layout/base';
import {
  authSignUp,
  authUpdateEmail,
  authUpdatePassword,
  authUpdateConfirmPassword,
  authClearFields
} from '../reducers/_auth';

const StyledForm = styled(Form)`
  padding: 20px;
`;

class SignUp extends Component {
  onSubmit = e => {
    e.preventDefault();
    this.props.authSignUp(this.props.email, this.props.password, this.props.confirmPassword);
  };
  componentWillUnmount() {
    this.props.authClearFields();
  }
  render() {
    return (
      <BaseLayout fetching={this.props.fetching}>
        <StyledForm onSubmit={this.onSubmit}>
          <h4>Create a new account</h4>
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
          <Input
            placeholder="Confirm Password"
            type="password"
            value={this.props.confirmPassword}
            onChange={({ target }) => this.props.authUpdateConfirmPassword(target.value)}
          />
          <Button type="submit">Create Account</Button>
        </StyledForm>
      </BaseLayout>
    );
  }
}

SignUp.propTypes = {
  authSignUp: PropTypes.func.isRequired,
  authUpdateEmail: PropTypes.func.isRequired,
  authUpdatePassword: PropTypes.func.isRequired,
  authUpdateConfirmPassword: PropTypes.func.isRequired,
  authClearFields: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  confirmPassword: PropTypes.string.isRequired
};

const reduxProps = ({ auth }) => ({
  fetching: auth.fetching,
  email: auth.email,
  password: auth.password,
  confirmPassword: auth.confirmPassword
});

export default connect(reduxProps, {
  authSignUp,
  authUpdateEmail,
  authUpdatePassword,
  authUpdateConfirmPassword,
  authClearFields
})(SignUp);
