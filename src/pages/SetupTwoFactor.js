import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import InputTwoFactor from '../components/InputTwoFactor';
import Button from '../components/Button';
import Form from '../components/Form';
import Title from '../components/Title';
import QRCodeDisplay from '../components/QRCodeDisplay';
import Reload from '../components/Reload';
import BaseLayout from '../layout/base';
import { authRequestTwoFactor, authEnableTwoFactor } from '../reducers/_auth';

const StyledForm = styled(Form)`
  padding: 20px;
`;

const StyledParagraph = styled.p`
  margin: 10px 0;
`;

const StyledWrapper = styled.div`
  width: 100%;
  margin: 20px auto;
`;

class SetupTwoFactor extends Component {
  state = {
    code: ''
  };
  componentDidMount() {
    this.props.authRequestTwoFactor();
  }
  onSubmit = e => {
    e.preventDefault();
    this.props.authEnableTwoFactor(this.state.code);
  };
  render() {
    return (
      <BaseLayout fetching={this.props.fetching}>
        {!!this.props.uri ? (
          <StyledForm onSubmit={this.onSubmit}>
            <Title>Enable Two Factor authentication</Title>
            <QRCodeDisplay data={this.props.uri} scale={5} />
            <StyledParagraph>
              Scan the QR code with your Authenticator app and type the code to enable
            </StyledParagraph>
            <StyledParagraph>You can use Google Authenticator, Authy or 1Password</StyledParagraph>
            <InputTwoFactor
              placeholder="6 Digit Code"
              type="text"
              value={this.state.code}
              onChange={code => this.setState({ code })}
            />
            <Button
              fetching={this.props.fetchingTwoFactor}
              disabled={this.state.code < 6}
              type="submit"
            >
              Enable
            </Button>
          </StyledForm>
        ) : (
          <StyledWrapper>
            <Reload onClick={this.props.authRequestTwoFactor} />
          </StyledWrapper>
        )}
      </BaseLayout>
    );
  }
}

SetupTwoFactor.propTypes = {
  authRequestTwoFactor: PropTypes.func.isRequired,
  authEnableTwoFactor: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
  uri: PropTypes.string.isRequired,
  fetchingTwoFactor: PropTypes.bool.isRequired
};

const reduxProps = ({ auth, user }) => ({
  fetching: auth.fetching,
  uri: auth.uri,
  fetchingTwoFactor: auth.fetchingTwoFactor
});

export default connect(reduxProps, {
  authRequestTwoFactor,
  authEnableTwoFactor
})(SetupTwoFactor);
