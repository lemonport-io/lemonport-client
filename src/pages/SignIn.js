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
  authUpdateCode,
  authUpdateFields,
  authClearFields
} from '../reducers/_auth';
import { initFB, checkStatusFB, fetchFB } from '../helpers/facebook';

const StyledForm = styled(Form)`
  padding: 20px;
`;

const StyledProfile = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & img {
    border-radius: 50%;
    width: 160px;
    height: 160px;
    margin: 10px;
  }
  & p {
    font-weight: 700;
  }
`;

class SignIn extends Component {
  componentDidMount() {
    initFB().then(() =>
      checkStatusFB()
        .then(response => {
          if (response.status === 'connected') {
            fetchFB('/me?fields=id,email,first_name,last_name').then(data => {
              const { id, email, first_name, last_name } = data;
              this.props.authUpdateFields({
                email,
                facebookID: id,
                firstName: first_name,
                lastName: last_name
              });
            });
            fetchFB('me/picture?type=large').then(({ data }) => {
              console.log(data);
              this.props.authUpdateFields({
                profileImage: data.url
              });
            });
          } else {
          }
        })
        .catch(error => console.error(error))
    );
  }
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
            {!!this.props.facebookID ? (
              <StyledProfile>
                <img src={this.props.profileImage} alt="profile" />
                <p>{`${this.props.firstName} ${this.props.lastName}`}</p>
              </StyledProfile>
            ) : (
              <Input
                transparent
                placeholder="Email"
                type="email"
                value={this.props.email}
                onChange={({ target }) => this.props.authUpdateFields({ email: target.value })}
              />
            )}

            <Input
              transparent
              placeholder="Password"
              type="password"
              value={this.props.password}
              onChange={({ target }) => this.props.authUpdateFields({ password: target.value })}
            />
            <Button outline type="submit">
              Sign In
            </Button>
          </StyledForm>
        ) : (
          <StyledForm onSubmit={this.onSubmit}>
            <h4>Two Factor authentication</h4>

            <InputTwoFactor
              transparent
              placeholder="6 Digit Code"
              type="text"
              value={this.props.code}
              onChange={code => this.props.authUpdateCode(code)}
            />
            <Button outline type="submit">
              Sign In
            </Button>
          </StyledForm>
        )}
      </BaseLayout>
    );
  }
}

SignIn.propTypes = {
  authSignIn: PropTypes.func.isRequired,
  authSignInTwoFactor: PropTypes.func.isRequired,
  authUpdateCode: PropTypes.func.isRequired,
  authUpdateFields: PropTypes.func.isRequired,
  authClearFields: PropTypes.func.isRequired,
  facebookID: PropTypes.string.isRequired,
  profileImage: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  fetchingTwoFactor: PropTypes.bool.isRequired,
  requireTwoFactor: PropTypes.bool.isRequired
};

const reduxProps = ({ auth }) => ({
  fetching: auth.fetching,
  facebookID: auth.facebookID,
  profileImage: auth.profileImage,
  firstName: auth.firstName,
  lastName: auth.lastName,
  email: auth.email,
  password: auth.password,
  code: auth.code,
  fetchingTwoFactor: auth.fetchingTwoFactor,
  requireTwoFactor: auth.requireTwoFactor
});

export default connect(reduxProps, {
  authSignIn,
  authSignInTwoFactor,
  authUpdateCode,
  authUpdateFields,
  authClearFields
})(SignIn);
