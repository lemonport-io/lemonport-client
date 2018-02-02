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
import Select from '../components/Select';
import ButtonClose from '../components/ButtonClose';
import qrIcon from '../assets/qr-code.svg';
import {
  sendGetGasPrices,
  sendUpdateGasPrice,
  sendEtherApi,
  sendEtherClient,
  sendTokenApi,
  sendTokenClient,
  sendClearFields,
  sendUpdateRecipient,
  sendUpdateAmount,
  sendUpdatePrivateKey,
  sendUpdateSelected,
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

const StyledSelect = styled(Select)`
  position: absolute;
  right: 0;
  top: 10px;
  @media screen and (${responsive.sm.max}) {
    margin: 3px;
  }
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

const StyledOptions = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 54px;
  & p {
    margin-top: 2px;
  }
  & p:first-child {
    font-weight: 500;
  }
  & p:last-child {
    font-weight: 400;
    font-size: 12px;
  }
`;

class SendEtherModal extends Component {
  componentDidMount() {
    this.props.userCheckTwoFactor();
    this.props.sendGetGasPrices();
  }
  state = {
    confirm: false,
    isChecksum: false,
    showQRCodeReader: false,
    QRCodeReaderTarget: ''
  };
  componentWillReceiveProps(newProps) {
    if (newProps.recipient.length >= 42) {
      if (newProps.selected !== this.props.selected) {
        this.props.sendUpdateGasPrice();
      } else if (newProps.recipient !== this.props.recipient) {
        this.props.sendUpdateGasPrice();
      } else if (newProps.amount !== this.props.amount) {
        this.props.sendUpdateGasPrice();
      }
    }
  }
  onGoBack = () => {
    if (this.props.modalProps.type === 'COLD') {
      this.props.sendUpdatePrivateKey('');
    }
    this.setState({ confirm: false });
  };
  onSendAnother = () => {
    this.props.sendGetGasPrices();
    this.setState({ confirm: false });
    this.props.sendClearFields();
  };
  onSubmit = e => {
    e.preventDefault();
    const request = {
      address: this.props.modalProps.address,
      recipient: this.props.recipient,
      amount: this.props.amount,
      privateKey: this.props.privateKey,
      token: this.props.selected,
      gasPrice: this.props.gasPrice,
      code: this.props.code
    };
    if (!this.state.confirm) {
      if (!isValidAddress(this.props.recipient)) {
        this.props.notificationShow(`Address is invalid, please check again`, true);
        return;
      }
      this.setState({ confirm: true });
    } else if (this.props.modalProps.type === 'HOT') {
      if (this.props.selected === 'ETH') {
        this.props.sendEtherApi(request);
      } else {
        this.props.sendTokenApi(request);
      }
    } else {
      if (this.props.selected === 'ETH') {
        this.props.sendEtherClient(request);
      } else {
        this.props.sendTokenClient(request);
      }
    }
  };
  toggleQRCodeReader = target =>
    this.setState({ showQRCodeReader: !this.state.showQRCodeReader, QRCodeReaderTarget: target });
  onQRCodeScan = data => {
    if (this.state.QRCodeReaderTarget === 'recipient') {
      this.props.sendUpdateRecipient(data);
    } else if (this.state.QRCodeReaderTarget === 'privateKey') {
      this.props.sendUpdatePrivateKey(data);
    }
    this.setState({ showQRCodeReader: false, QRCodeReaderTarget: '' });
  };
  onQRCodeError = () => {
    this.props.notificationShow(`Failed to scan QR code, please try again`, true);
  };
  onClose = () => {
    this.props.sendClearFields();
    this.props.closeModal();
  };
  render = () => {
    let selectOptions = [];
    if (this.props.modalProps.tokens) {
      selectOptions = this.props.modalProps.tokens.map(token => token.symbol);
    }
    selectOptions.unshift('ETH');
    return (
      <Card>
        <ButtonClose onClick={this.onClose} />
        {!this.props.transaction ? (
          !this.state.confirm ? (
            <StyledForm onSubmit={this.onSubmit}>
              <StyledFlex>
                <h4>{`Send from ${this.props.modalProps.name}`}</h4>
                <StyledAccountType>{this.props.modalProps.type}</StyledAccountType>
              </StyledFlex>
              <StyledFlex>
                <Input
                  placeholder="Recipient"
                  type="text"
                  value={this.props.recipient}
                  onChange={({ target }) => this.props.sendUpdateRecipient(target.value)}
                />
                <StyledQRIcon onClick={() => this.toggleQRCodeReader('recipient')} />
              </StyledFlex>
              <StyledFlex>
                <Input
                  placeholder="Amount"
                  type="text"
                  value={this.props.amount}
                  onChange={({ target }) => this.props.sendUpdateAmount(target.value)}
                />
                <StyledSelect
                  dark
                  selected={this.props.selected}
                  options={selectOptions}
                  onChange={({ target }) => this.props.sendUpdateSelected(target.value)}
                />
              </StyledFlex>
              {this.props.modalProps.type === 'COLD' && (
                <StyledFlex>
                  <Input
                    placeholder="Private Key"
                    type="text"
                    value={this.props.privateKey}
                    onChange={({ target }) => this.props.sendUpdatePrivateKey(target.value)}
                  />
                  <StyledQRIcon onClick={() => this.toggleQRCodeReader('privateKey')} />
                </StyledFlex>
              )}
              <StyledParagraph>
                <strong>Transaction Fee:</strong>
                {this.props.txFee &&
                  ` ${BigNumber(this.props.txFee).toFormat(6)} ETH (${convertToNative(
                    this.props.txFee
                  )})`}
              </StyledParagraph>
              <StyledOptions>
                <StyledButton
                  dark
                  disabled={this.props.recipient.length !== 42}
                  onClick={() => this.props.sendUpdateGasPrice(this.props.gasPrices.average)}
                >
                  <p>Slow</p>
                  <p>{`${this.props.gasPrices.average || 0} Gwei ≈ ${this.props.gasPrices.avgWait ||
                    0} mins`}</p>
                </StyledButton>
                <StyledButton
                  dark
                  disabled={this.props.recipient.length !== 42}
                  onClick={() => this.props.sendUpdateGasPrice(this.props.gasPrices.fast)}
                >
                  <p>Fast</p>
                  <p>{`${this.props.gasPrices.fast || 0} Gwei ≈ ${this.props.gasPrices.fastWait ||
                    0} mins`}</p>
                </StyledButton>
              </StyledOptions>
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
                  onClose={() => this.toggleQRCodeReader('')}
                />
              )}
            </StyledForm>
          ) : (
            <StyledForm onSubmit={this.onSubmit}>
              <StyledFlex>
                <h4>{`Confirm transaction from ${this.props.modalProps.name}`}</h4>
                <StyledAccountType>{this.props.modalProps.type}</StyledAccountType>
              </StyledFlex>
              {this.props.modalProps.type === 'COLD' && (
                <StyledParagraph>
                  <strong>Private Key:</strong>
                  {` Private Key Confirmed`}
                </StyledParagraph>
              )}
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
                  ` ${BigNumber(this.props.amount).toFormat(6)} ${this.props.selected} ${
                    convertToNative(this.props.amount, this.props.selected)
                      ? `(${convertToNative(this.props.amount, this.props.selected)})`
                      : ``
                  }`}
              </StyledParagraph>
              <StyledParagraph>
                <strong>Transaction Fee:</strong>
                {this.props.txFee &&
                  ` ${BigNumber(this.props.txFee).toFormat(6)} ETH (${convertToNative(
                    this.props.txFee
                  )})`}
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

SendEtherModal.propTypes = {
  sendGetGasPrices: PropTypes.func.isRequired,
  sendUpdateGasPrice: PropTypes.func.isRequired,
  sendEtherApi: PropTypes.func.isRequired,
  sendEtherClient: PropTypes.func.isRequired,
  sendTokenApi: PropTypes.func.isRequired,
  sendTokenClient: PropTypes.func.isRequired,
  sendClearFields: PropTypes.func.isRequired,
  sendUpdateRecipient: PropTypes.func.isRequired,
  sendUpdateAmount: PropTypes.func.isRequired,
  sendUpdatePrivateKey: PropTypes.func.isRequired,
  sendUpdateSelected: PropTypes.func.isRequired,
  sendUpdateCode: PropTypes.func.isRequired,
  notificationShow: PropTypes.func.isRequired,
  userCheckTwoFactor: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  modalProps: PropTypes.object.isRequired,
  fetching: PropTypes.bool.isRequired,
  recipient: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  transaction: PropTypes.string.isRequired,
  privateKey: PropTypes.string.isRequired,
  selected: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  fetchingGasPrices: PropTypes.bool.isRequired,
  gasPrices: PropTypes.object.isRequired,
  gasPrice: PropTypes.number.isRequired,
  txFee: PropTypes.string.isRequired,
  twoFactor: PropTypes.bool.isRequired
};

const reduxProps = ({ send, user, overview }) => ({
  fetching: send.fetching,
  recipient: send.recipient,
  amount: send.amount,
  transaction: send.transaction,
  privateKey: send.privateKey,
  selected: send.selected,
  code: send.code,
  fetchingGasPrices: send.fetchingGasPrices,
  gasPrices: send.gasPrices,
  gasPrice: send.gasPrice,
  txFee: send.txFee,
  twoFactor: user.twoFactor
});

export default connect(reduxProps, {
  sendGetGasPrices,
  sendUpdateGasPrice,
  sendEtherApi,
  sendEtherClient,
  sendTokenApi,
  sendTokenClient,
  sendClearFields,
  sendUpdateRecipient,
  sendUpdateAmount,
  sendUpdatePrivateKey,
  sendUpdateSelected,
  sendUpdateCode,
  notificationShow,
  userCheckTwoFactor
})(SendEtherModal);
