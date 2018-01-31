import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Card from '../components/Card';
import InputTwoFactor from '../components/InputTwoFactor';
import Button from '../components/Button';
import Form from '../components/Form';
import QRCodeDisplay from '../components/QRCodeDisplay';
import cross from '../assets/cross.svg';
import { userEnableTwoFactor } from '../reducers/_user';
import { responsive } from '../styles';

const StyledClose = styled.img`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 18px;
  height: 18px;

  @media (hover: hover) {
    &:hover {
      opacity: 0.6;
    }
  }
`;

const StyledContent = styled.div`
  @media screen and (${responsive.sm.min}) {
    padding: 20px;
  }
`;

const StyledForm = styled(Form)`
  @media screen and (${responsive.sm.min}) {
    padding: 20px;
  }
`;

const StyledWrapper = styled.div`
  display: flex;
  justify-content: space-around;
`;

const StyledParagraph = styled.p`
  margin: 10px 0;
`;

class SetupTwoFactorModal extends Component {
  state = {
    code: ''
  };
  onSubmit = e => {
    e.preventDefault();
    this.props.userEnableTwoFactor(this.state.code);
  };
  onClose = () => {
    this.props.closeModal();
  };
  render = () => (
    <Card fetching={this.props.fetching}>
      {!!this.props.twoFactor ? (
        <StyledContent>
          <h4>Success! Two Factor authentication is enabled</h4>
          <StyledWrapper>
            <Button dark onClick={this.onClose}>
              Close
            </Button>
          </StyledWrapper>
        </StyledContent>
      ) : (
        <div>
          <StyledClose onClick={this.onClose} src={cross} />
          <StyledForm onSubmit={this.onSubmit}>
            <h4>Enable Two Factor authentication</h4>
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
              fetching={this.props.enablingTwoFactor}
              disabled={this.state.code < 6}
              type="submit"
            >
              Enable
            </Button>
          </StyledForm>
        </div>
      )}
    </Card>
  );
}

SetupTwoFactorModal.propTypes = {
  userEnableTwoFactor: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  modalProps: PropTypes.object.isRequired,
  fetching: PropTypes.bool.isRequired,
  enablingTwoFactor: PropTypes.bool.isRequired,
  twoFactor: PropTypes.bool.isRequired,
  uri: PropTypes.string.isRequired
};

const reduxProps = ({ user }) => ({
  fetching: user.fetching,
  enablingTwoFactor: user.enablingTwoFactor,
  twoFactor: user.twoFactor,
  uri: user.uri
});

export default connect(reduxProps, { userEnableTwoFactor })(SetupTwoFactorModal);
