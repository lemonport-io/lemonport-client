import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Input from '../components/Input';
import Button from '../components/Button';
import Form from '../components/Form';
import BaseLayout from '../layout/base';
import { authSignUp, authUpdateFields, authClearFields } from '../reducers/_auth';
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

class SignUp extends Component {
  componentDidMount() {
    initFB().then(() =>
      checkStatusFB()
        .then(response => {
          if (response.status === 'connected') {
            fetchFB('/me?fields=id,email,first_name,last_name').then(data => {
              const { id, email, first_name, last_name } = data;
              console.log(data);
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
    const { firstName, lastName, email, password, confirmPassword, facebookID } = this.props;
    this.props.authSignUp({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      facebookID
    });
  };
  componentWillUnmount() {
    this.props.authClearFields();
  }
  render() {
    return (
      <BaseLayout fetching={this.props.fetching}>
        <StyledForm onSubmit={this.onSubmit}>
          <h4>Create a new account</h4>
          {!!this.props.facebookID ? (
            <StyledProfile>
              <img src={this.props.profileImage} alt="profile" />
              <p>{`${this.props.firstName} ${this.props.lastName}`}</p>
            </StyledProfile>
          ) : (
            <div>
              <Input
                transparent
                placeholder="First Name"
                type="text"
                value={this.props.firstName}
                onChange={({ target }) => this.props.authUpdateFields({ firstName: target.value })}
              />
              <Input
                transparent
                placeholder="Last Name"
                type="text"
                value={this.props.lastName}
                onChange={({ target }) => this.props.authUpdateFields({ lastName: target.value })}
              />
              <Input
                transparent
                placeholder="Email"
                type="email"
                value={this.props.email}
                onChange={({ target }) => this.props.authUpdateFields({ email: target.value })}
              />
            </div>
          )}
          <Input
            transparent
            placeholder="Password"
            type="password"
            value={this.props.password}
            onChange={({ target }) => this.props.authUpdateFields({ password: target.value })}
          />
          <Input
            transparent
            placeholder="Confirm Password"
            type="password"
            value={this.props.confirmPassword}
            onChange={({ target }) =>
              this.props.authUpdateFields({ confirmPassword: target.value })
            }
          />
          <Button outline type="submit">
            Create Account
          </Button>
        </StyledForm>
      </BaseLayout>
    );
  }
}

SignUp.propTypes = {
  authSignUp: PropTypes.func.isRequired,
  authUpdateFields: PropTypes.func.isRequired,
  authClearFields: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
  facebookID: PropTypes.string.isRequired,
  profileImage: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  confirmPassword: PropTypes.string.isRequired
};

const reduxProps = ({ auth }) => ({
  fetching: auth.fetching,
  facebookID: auth.facebookID,
  profileImage: auth.profileImage,
  firstName: auth.firstName,
  lastName: auth.lastName,
  email: auth.email,
  password: auth.password,
  confirmPassword: auth.confirmPassword
});

export default connect(reduxProps, {
  authSignUp,
  authUpdateFields,
  authClearFields
})(SignUp);
