import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Card from '../components/Card';
import Button from '../components/Button';
import InputTwoFactor from '../components/InputTwoFactor';
import ButtonClose from '../components/ButtonClose';
import { userCheckTwoFactor } from '../reducers/_user';
import { dashboardDeleteAccount } from '../reducers/_dashboard';
import { responsive } from '../styles';

const StyledContent = styled.div`
  @media screen and (${responsive.sm.min}) {
    padding: 20px;
  }
`;

const StyledWrapper = styled.div`
  display: flex;
  margin: 10px 0;
  justify-content: space-between;
`;

const StyledParagraph = styled.p`
  margin: 10px 0;
`;

class DeleteAccountModal extends Component {
  state = {
    code: ''
  };
  componentDidMount() {
    this.props.userCheckTwoFactor();
  }
  onSubmit = e => {
    e.preventDefault();
    this.props.dashboardDeleteAccount(this.props.modalProps.address, this.state.code);
  };
  onClose = () => {
    this.props.closeModal();
  };
  render = () => (
    <Card>
      <ButtonClose onClick={this.onClose} />
      <StyledContent>
        <h4>{`Delete wallet: ${this.props.modalProps.name}`}</h4>
        <StyledParagraph>Are you sure you want to delete this wallet?</StyledParagraph>
        {!!this.props.twoFactor && (
          <div>
            <StyledParagraph>
              <strong>Type your Two Factor code</strong>
            </StyledParagraph>
            <InputTwoFactor
              placeholder="6 Digit Code"
              type="text"
              value={this.state.code}
              onChange={code => this.setState({ code })}
            />
          </div>
        )}
        <StyledWrapper>
          <Button outline onClick={this.onGoBack}>
            Go Back
          </Button>
          <Button
            dark
            disabled={this.props.twoFactor && this.state.code < 6}
            fetching={this.props.fetching}
            onClick={this.onSubmit}
          >
            Send
          </Button>
        </StyledWrapper>
      </StyledContent>
    </Card>
  );
}

DeleteAccountModal.propTypes = {
  dashboardDeleteAccount: PropTypes.func.isRequired,
  userCheckTwoFactor: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  modalProps: PropTypes.object.isRequired,
  fetching: PropTypes.bool.isRequired,
  twoFactor: PropTypes.bool.isRequired
};

const reduxProps = ({ dashboard, user }) => ({
  fetching: dashboard.fetching,
  twoFactor: user.twoFactor
});

export default connect(reduxProps, {
  dashboardDeleteAccount,
  userCheckTwoFactor
})(DeleteAccountModal);
