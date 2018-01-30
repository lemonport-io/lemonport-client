import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Card from '../components/Card';
import Button from '../components/Button';
import TextButton from '../components/TextButton';
import Title from '../components/Title';
import PopUp from '../components/PopUp';
import dots from '../assets/dots.svg';
import { responsive, fonts, colors, transitions } from '../styles';
import { modalOpen } from '../reducers/_modal';
import { notificationShow } from '../reducers/_notification';

const StyledAddress = styled.div`
  font-size: 12px;
  opacity: 0.7;
  margin-top: 0;
  @media screen and (${responsive.sm.max}) {
    font-size: 10px;
  }
`;

const StyledFlex = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const StyledActions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const StyledAccountType = styled.span`
  font-size: ${fonts.size.small};
  font-family: Roboto, sans-serif;
  opacity: 0.6;
`;

const StyledBalance = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
`;

const StyledAccount = styled.div`
  width: 100%;
  margin: 10px auto;
`;

const StyledSettings = styled.img`
  transition: ${transitions.base};
  width: 24px;
  height: 12px;
  position: absolute;
  top: 12px;
  right: 12px;
  mask: url(${dots}) center no-repeat;
  mask-size: 90%;
  background-color: rgb(${colors.white});
  @media (hover: hover) {
    &:hover {
      opacity: 0.6;
    }
  }
`;

const StyledPopUp = styled(PopUp)`
  top: 20px;
  right: 10px;
  padding: 5px 10px;
`;

const StyledLine = styled.div`
  width: 100%;
  border-top: 1px solid rgb(${colors.lightGrey});
`;

class Account extends Component {
  state = {
    openSettings: false
  };
  toggleSettings = () => {
    this.setState({ openSettings: !this.state.openSettings });
  };
  toggleSettings = () => {
    this.setState({ openSettings: !this.state.openSettings });
  };
  openSendModal = () =>
    this.props.modalOpen('SEND_ETHER', {
      name: this.props.account.name,
      address: this.props.account.address,
      type: this.props.account.type,
      tokens: this.props.account.tokens
    });
  openReceiveModal = () =>
    this.props.modalOpen('RECEIVE_ETHER', {
      name: this.props.account.name,
      address: this.props.account.address
    });
  openRenameAccountModal = () =>
    this.props.modalOpen('RENAME_ACCOUNT', {
      name: this.props.account.name,
      address: this.props.account.address
    });
  openDeleteAccountModal = () =>
    this.props.modalOpen('DELETE_ACCOUNT', {
      name: this.props.account.name,
      address: this.props.account.address
    });
  getPrice = (amount, symbol) => {
    const priceObject = this.props.prices[symbol];
    const native = this.props.nativeCurrency;
    const _amount = Number(amount.replace(/[^0-9.]/gi, ''))
    const decimals = native === 'ETH' || native === 'BTC' ? 8 : 2;
    if (priceObject) {
      const result = String(_amount * priceObject[native]);
      return `${BigNumber(result).toFormat(decimals)} ${native}`;
    }
    return null;
  };
  shouldComponentUpdate(nextProps) {
    if (
      nextProps.nativeCurrency !== this.props.nativeCurrency &&
      nextProps.prices === this.props.prices
    )
      return false;
    return true;
  }
  render = () => (
    <StyledAccount>
      <Card>
        <StyledFlex>
          <StyledSettings onClick={this.toggleSettings} />
          <StyledPopUp show={this.state.openSettings}>
            <TextButton onClick={this.openRenameAccountModal}>Rename</TextButton>
            <TextButton color="red" onClick={this.openDeleteAccountModal}>
              Delete
            </TextButton>
          </StyledPopUp>
          <StyledFlex>
            <div>
              <Title>
                {this.props.account.name}{' '}
                <StyledAccountType>{this.props.account.type}</StyledAccountType>
              </Title>
              <StyledAddress>{this.props.account.address}</StyledAddress>
            </div>
          </StyledFlex>
          <StyledBalance>
            <div>{`${this.props.account.balance} ETH`}</div>
            <div>{this.getPrice(this.props.account.balance, 'ETH')}</div>
          </StyledBalance>
          {!!this.props.account.tokens && <StyledLine />}
          {!!this.props.account.tokens &&
            this.props.account.tokens.map(token => (
              <StyledBalance key={`${this.props.account.address}-${token.symbol}`}>
                <div>{`${token.balance} ${token.symbol}`}</div>
                <div>{this.getPrice(token.balance, token.symbol)}</div>
              </StyledBalance>
            ))}
        </StyledFlex>
      </Card>
      <StyledActions>
        <Button onClick={this.openSendModal}>Send</Button>
        <Button onClick={this.openReceiveModal}>Receive</Button>
      </StyledActions>
    </StyledAccount>
  );
}

Account.propTypes = {
  account: PropTypes.object.isRequired,
  modalOpen: PropTypes.func.isRequired,
  notificationShow: PropTypes.func.isRequired,
  prices: PropTypes.object.isRequired,
  nativeCurrency: PropTypes.string.isRequired
};

const reduxProps = ({ dashboard }) => ({
  prices: dashboard.prices,
  nativeCurrency: dashboard.nativeCurrency
});

export default connect(reduxProps, {
  modalOpen,
  notificationShow
})(Account);
