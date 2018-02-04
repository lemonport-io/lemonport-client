import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import QRCodeReader from '../components/QRCodeReader';
import Card from '../components/Card';
import Input from '../components/Input';
import InputTwoFactor from '../components/InputTwoFactor';
import Button from '../components/Button';
import Form from '../components/Form';
import ButtonClose from '../components/ButtonClose';
import qrIcon from '../assets/qr-code.svg';
import currencies from '../libraries/currencies.json';
import {
  sendGetTransactionFee,
  sendUpdateGasPrice,
  sendEtherApi,
  sendTokenApi,
  sendClearFields,
  sendUpdateRecipient,
  sendUpdateAmount,
  sendUpdateCode
} from '../reducers/_send';
import { isValidAddress } from '../helpers/validators';
import { convertToNative } from '../helpers/utilities';
import { userCheckTwoFactor } from '../reducers/_user';
import { notificationShow } from '../reducers/_notification';
import { fonts, colors, responsive } from '../styles';

const StyledMessage = styled.div`
  @media screen and (${responsive.sm.min}) {
    padding: 20px;
  }
  & a {
    text-decoration: underline;
    font-weight: ${fonts.weight.semibold};
  }
  & > * {
    margin-top: 10px;
  }
`;

const StyledForm = styled(Form)`
  @media screen and (${responsive.sm.min}) {
    padding: 20px;
  }
`;

const StyledFlex = styled.div`
  display: flex;
  position: relative;
  transform: none;
`;

const StyledParagraph = styled.p`
  margin: 10px 0;
`;

const StyledHash = styled.p`
  margin: 0;
  padding: 0;
  font-family: monospace;
  font-size: ${fonts.size.small};
`;

const StyledAccountType = styled.span`
  font-size: ${fonts.size.small};
  font-family: Roboto, sans-serif;
  opacity: 0.7;
  line-height: 2.4;
  padding-left: 12px;
  font-weight: ${fonts.weight.semibold};
`;

const StyledCurrency = styled.div`
  position: absolute;
  right: 0;
  color: rgb(${colors.dark});
  padding: 10px;
  top: 10px;
`;

const StyledWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledQRIcon = styled.img`
  position: absolute;
  right: 0;
  top: 10px;
  width: 22px;
  height: 22px;
  margin: 8px;
  mask: url(${qrIcon}) center no-repeat;
  mask-size: 95%;
  background-color: rgb(${colors.dark});
  @media screen and (${responsive.sm.max}) {
    margin: 6px;
  }
  @media (hover: hover) {
    &:hover {
      opacity: 0.7;
    }
  }
`;

class SendModal extends Component {
  componentDidMount() {
    this.props.userCheckTwoFactor();
    this.props.sendGetTransactionFee(this.props.modalProps.currency);
  }
  state = {
    confirm: false,
    isChecksum: false,
    showQRCodeReader: false
  };
  componentWillReceiveProps(newProps) {
    if (newProps.recipient.length >= 42) {
      if (newProps.recipient !== this.props.recipient) {
        this.props.sendUpdateGasPrice(null, this.props.modalProps.currency);
      } else if (newProps.amount !== this.props.amount) {
        this.props.sendUpdateGasPrice(null, this.props.modalProps.currency);
      }
    }
  }
  onGoBack = () => {
    this.setState({ confirm: false });
  };
  onSendAnother = () => {
    this.props.sendGetTransactionFee(this.props.modalProps.currency);
    this.setState({ confirm: false });
    this.props.sendClearFields();
  };
  onSubmit = e => {
    e.preventDefault();
    const request = {
      address: this.props.modalProps.address,
      recipient: this.props.recipient,
      amount: this.props.amount,
      gasPrice: this.props.gasPrice,
      code: this.props.code
    };
    if (!this.state.confirm) {
      if (!isValidAddress(this.props.recipient)) {
        this.props.notificationShow(`Address is invalid, please check again`, true);
        return;
      }
      this.setState({ confirm: true });
    } else {
      if (this.props.modalProps.currency === 'ETH') {
        this.props.sendEtherApi(request);
      } else if (this.props.modalProps.currency === 'BTC') {
        this.props.sendBitcoinApi(request);
      } else {
        this.props.sendTokenApi(request);
      }
    }
  };
  toggleQRCodeReader = target => this.setState({ showQRCodeReader: !this.state.showQRCodeReader });
  onQRCodeScan = data => {
    this.props.sendUpdateRecipient(data);
    this.setState({ showQRCodeReader: false });
  };
  onQRCodeError = () => {
    this.props.notificationShow(`Failed to scan QR code, please try again`, true);
  };
  onClose = () => {
    this.props.sendClearFields();
    this.props.closeModal();
  };
  render = () => {
    return (
      <Card>
        <ButtonClose onClick={this.onClose} />
        {!this.props.transaction ? (
          !this.state.confirm ? (
            <StyledForm onSubmit={this.onSubmit}>
              <StyledFlex>
                <h4>{`Send ${currencies[this.props.modalProps.currency].name}`}</h4>
                <StyledAccountType>{this.props.modalProps.type}</StyledAccountType>
              </StyledFlex>
              <StyledFlex>
                <Input
                  placeholder="Recipient"
                  type="text"
                  value={this.props.recipient}
                  onChange={({ target }) => this.props.sendUpdateRecipient(target.value)}
                />
                <StyledQRIcon onClick={this.toggleQRCodeReader} />
              </StyledFlex>
              <StyledFlex>
                <Input
                  placeholder="Amount"
                  type="text"
                  value={this.props.amount}
                  onChange={({ target }) => this.props.sendUpdateAmount(target.value)}
                />
                <StyledCurrency>{this.props.modalProps.currency}</StyledCurrency>
              </StyledFlex>
              <StyledParagraph>
                <strong>Transaction Fee:</strong>
                {this.props.txFee &&
                  ` ${BigNumber(this.props.txFee).toFormat(8)} ${this.props.modalProps.currency} (${
                    convertToNative(this.props.txFee, this.props.modalProps.currency).string
                  })`}
              </StyledParagraph>
              <Button
                disabled={this.props.recipient.length !== 42 || !this.props.amount.length}
                fetching={this.props.fetching}
                type="submit"
              >
                Send
              </Button>
              {this.state.showQRCodeReader && (
                <QRCodeReader
                  onScan={this.onQRCodeScan}
                  onError={this.onQRCodeError}
                  onClose={this.toggleQRCodeReader}
                />
              )}
            </StyledForm>
          ) : (
            <StyledForm onSubmit={this.onSubmit}>
              <StyledFlex>
                <h4>{`Confirm ${currencies[this.props.modalProps.currency].name} transaction`}</h4>
                <StyledAccountType>{this.props.modalProps.type}</StyledAccountType>
              </StyledFlex>
              <StyledParagraph>
                <strong>Sender:</strong>
                {` ${this.props.modalProps.address}`}
              </StyledParagraph>
              <StyledParagraph>
                <strong>Recipient:</strong>
                {` ${this.props.recipient}`}
              </StyledParagraph>
              <StyledParagraph>
                <strong>Amount:</strong>
                {this.props.amount &&
                  ` ${BigNumber(this.props.amount).toFormat(8)} ${this.props.modalProps.currency} ${
                    convertToNative(this.props.amount, this.props.modalProps.currency).string
                  }`}
              </StyledParagraph>
              <StyledParagraph>
                <strong>Transaction Fee:</strong>
                {this.props.txFee &&
                  ` ${BigNumber(this.props.txFee).toFormat(8)} ${this.props.modalProps.currency} (${
                    convertToNative(this.props.txFee, this.props.modalProps.currency).string
                  })`}
              </StyledParagraph>
              {!!this.props.twoFactor && (
                <div>
                  <StyledParagraph>
                    <strong>Type your Two Factor code</strong>
                  </StyledParagraph>
                  <InputTwoFactor
                    placeholder="6 Digit Code"
                    type="text"
                    value={this.props.code}
                    onChange={code => this.props.sendUpdateCode(code)}
                  />
                </div>
              )}

              <StyledWrapper>
                <Button onClick={this.onGoBack}>Go Back</Button>
                <Button
                  dark
                  disabled={this.props.twoFactor && this.props.code < 6}
                  fetching={this.props.fetching}
                  type="submit"
                >
                  Send
                </Button>
              </StyledWrapper>
            </StyledForm>
          )
        ) : (
          <StyledMessage>
            <h4>Sent</h4>
            <StyledParagraph>Your transaction is currently pending</StyledParagraph>
            <StyledParagraph>
              <strong>Transaction Hash:</strong>
            </StyledParagraph>
            <StyledHash>{` ${this.props.transaction}`}</StyledHash>
            <StyledParagraph>
              You can verify your transaction{' '}
              <a href={`https://ropsten.etherscan.io/tx/${this.props.transaction}`} target="_blank">
                here
              </a>
            </StyledParagraph>
            <Button onClick={this.onSendAnother}>Send another</Button>
          </StyledMessage>
        )}
      </Card>
    );
  };
}

SendModal.propTypes = {
  sendGetTransactionFee: PropTypes.func.isRequired,
  sendUpdateGasPrice: PropTypes.func.isRequired,
  sendEtherApi: PropTypes.func.isRequired,
  sendTokenApi: PropTypes.func.isRequired,
  sendClearFields: PropTypes.func.isRequired,
  sendUpdateRecipient: PropTypes.func.isRequired,
  sendUpdateAmount: PropTypes.func.isRequired,
  sendUpdateCode: PropTypes.func.isRequired,
  notificationShow: PropTypes.func.isRequired,
  userCheckTwoFactor: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  modalProps: PropTypes.object.isRequired,
  fetching: PropTypes.bool.isRequired,
  recipient: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  transaction: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  fetchingGasPrices: PropTypes.bool.isRequired,
  txFee: PropTypes.string.isRequired,
  twoFactor: PropTypes.bool.isRequired
};

const reduxProps = ({ send, user, overview }) => ({
  fetching: send.fetching,
  recipient: send.recipient,
  amount: send.amount,
  transaction: send.transaction,
  code: send.code,
  fetchingGasPrices: send.fetchingGasPrices,
  txFee: send.txFee,
  twoFactor: user.twoFactor
});

export default connect(reduxProps, {
  sendGetTransactionFee,
  sendUpdateGasPrice,
  sendEtherApi,
  sendTokenApi,
  sendClearFields,
  sendUpdateRecipient,
  sendUpdateAmount,
  sendUpdateCode,
  notificationShow,
  userCheckTwoFactor
})(SendModal);
